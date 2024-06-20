#include "NativeWebsocketModule.h"
#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/dispatch.hpp>
#include <boost/asio/strand.hpp>
#include <algorithm>
#include <cstdlib>
#include <functional>
#include <iostream>
#include <memory>
#include <string>
#include <thread>
#include <vector>

namespace http = boost::beast::http;					 // from <boost/beast/http.hpp>
namespace websocket = boost::beast::websocket; // from <boost/beast/websocket.hpp>
namespace net = boost::asio;									 // from <boost/asio.hpp>
using tcp = boost::asio::ip::tcp;							 // from <boost/asio/ip/tcp.hpp>
using namespace std;

//------------------------------------------------------------------------------

// Report a failure
void fail(boost::beast::error_code ec, char const *what)
{
	std::cerr << what << ": " << ec.message() << "\n";
}

// Echoes back all received WebSocket messages
class session : public std::enable_shared_from_this<session>
{
	websocket::stream<boost::beast::tcp_stream> ws_;
	boost::beast::flat_buffer buffer_;

public:
	// Take ownership of the socket
	explicit session(tcp::socket &&socket)
			: ws_(std::move(socket))
	{
	}

	// Get on the correct executor
	void
	run()
	{
		// We need to be executing within a strand to perform async operations
		// on the I/O objects in this session. Although not strictly necessary
		// for single-threaded contexts, this example code is written to be
		// thread-safe by default.
		net::dispatch(ws_.get_executor(),
									boost::beast::bind_front_handler(
											&session::on_run,
											shared_from_this()));
	}

	// Start the asynchronous operation
	void
	on_run()
	{
		// Set suggested timeout settings for the websocket
		ws_.set_option(
				websocket::stream_base::timeout::suggested(
						boost::beast::role_type::server));

		// Set a decorator to change the Server of the handshake
		ws_.set_option(websocket::stream_base::decorator(
				[](websocket::response_type &res)
				{
					res.set(http::field::server,
									std::string(BOOST_BEAST_VERSION_STRING) +
											" websocket-server-async");
				}));
		// Accept the websocket handshake
		ws_.async_accept(
				boost::beast::bind_front_handler(
						&session::on_accept,
						shared_from_this()));
	}

	void
	on_accept(boost::beast::error_code ec)
	{
		if (ec)
			return fail(ec, "accept");

		// Read a message
		do_read();
	}

	void
	do_read()
	{
		// Read a message into our buffer
		ws_.async_read(
				buffer_,
				boost::beast::bind_front_handler(
						&session::on_read,
						shared_from_this()));
	}

	void
	on_read(
			boost::beast::error_code ec,
			std::size_t bytes_transferred)
	{
		boost::ignore_unused(bytes_transferred);

		// This indicates that the session was closed
		if (ec == websocket::error::closed)
			return;

		if (ec)
			return fail(ec, "read");

		// Echo the message
		ws_.text(ws_.got_text());
		ws_.async_write(
				buffer_.data(),
				boost::beast::bind_front_handler(
						&session::on_write,
						shared_from_this()));
	}

	void
	on_write(
			boost::beast::error_code ec,
			std::size_t bytes_transferred)
	{
		boost::ignore_unused(bytes_transferred);

		if (ec)
			return fail(ec, "write");

		// Clear the buffer
		buffer_.consume(buffer_.size());

		// Do another read
		do_read();
	}
};

//------------------------------------------------------------------------------

// Accepts incoming connections and launches the sessions
class listener : public std::enable_shared_from_this<listener>
{
	net::io_context &ioc_;
	tcp::acceptor acceptor_;
	bool is_running_;

public:
	listener(
			net::io_context &ioc,
			tcp::endpoint endpoint)
			: ioc_(ioc), acceptor_(ioc), is_running_(false)
	{
		boost::beast::error_code ec;

		// Open the acceptor
		acceptor_.open(endpoint.protocol(), ec);
		if (ec)
		{
			fail(ec, "open");
			return;
		}

		// Allow address reuse
		acceptor_.set_option(net::socket_base::reuse_address(true), ec);
		if (ec)
		{
			fail(ec, "set_option");
			return;
		}

		// Bind to the server address
		acceptor_.bind(endpoint, ec);
		if (ec)
		{
			fail(ec, "bind");
			return;
		}

		// Start listening for connections
		acceptor_.listen(net::socket_base::max_listen_connections, ec);
		if (ec)
		{
			fail(ec, "listen");
			return;
		}
	}

	// Start accepting incoming connections
	void run()
	{
		is_running_ = true;
		do_accept();
	}

	void stop()
	{
		acceptor_.close();
		ioc_.stop();
		is_running_ = false;
	}

	bool is_running() const { return is_running_; }

private:
	void do_accept()
	{
		// The new connection gets its own strand
		acceptor_.async_accept(
				net::make_strand(ioc_),
				boost::beast::bind_front_handler(
						&listener::on_accept,
						shared_from_this()));
	}

	void on_accept(boost::beast::error_code ec, tcp::socket socket)
	{
		if (ec)
		{
			fail(ec, "accept");
		}
		else
		{
			// Create the session and run it
			std::make_shared<session>(std::move(socket))->run();
		}

		// Accept another connection
		do_accept();
	}
};

namespace facebook::react
{

	NativeWebsocketModule::NativeWebsocketModule(std::shared_ptr<CallInvoker> jsInvoker)
			: NativeWebsocketModuleCxxSpec(std::move(jsInvoker)) {}

	std::shared_ptr<listener> server;
	net::io_context ioc;
	std::vector<std::thread> v;
	std::thread s_th;

	void NativeWebsocketModule::createServer(jsi::Runtime &rt, ServerOptions const &options)
	{
		if (server && ioc.stopped())
		{
			ioc.restart();
		}
		else if (server && !ioc.stopped())
		{
			// server is already running.
			return;
		}

		// TODO: RN 0.73.x broke this, why?
		// auto const address = net::ip::make_address(options.host.value_or("0.0.0.0"));
		// auto const port = static_cast<unsigned short>(options.port.value_or(9090));
		// auto const threads = options.threads.value_or(1);
		auto const address = net::ip::make_address("0.0.0.0");
		auto const port = static_cast<unsigned short>(9090);
		auto const threads = 1;

		server = std::make_shared<listener>(ioc, tcp::endpoint{address, port});
		server->run();

		s_th = std::thread([&]()
											 {
			for (unsigned i = 0; i < threads - 1; ++i)
			{
				v.emplace_back([] {
					ioc.run();
				});
			}

			ioc.run();

			for (auto &t : v)
			{
				if (t.joinable()) {
					t.join();
				}
			} });
	}

	void NativeWebsocketModule::stopServer(jsi::Runtime &rt)
	{
		if (server != nullptr && server->is_running())
		{
			server->stop();

			if (s_th.joinable())
			{
				s_th.join();
			}

			for (auto &t : v)
			{
				if (t.joinable())
				{
					t.join();
				}
			}

			v.clear();
		}
	}

	void NativeWebsocketModule::doSomething(jsi::Runtime &rt)
	{
		const std::string eventName = "something";
		emitDeviceEvent(
				rt,
				eventName,
				[jsInvoker = jsInvoker_](
						jsi::Runtime &rt, std::vector<jsi::Value> &args)
				{
					args.emplace_back(jsi::Value(1337));
					args.emplace_back(jsi::String::createFromAscii(rt, "stringArgs"));
				});
	}

} // namespace facebook::react
