#pragma once

#if __has_include(<React-Codegen/AppSpecsJSI.h>) // CocoaPod headers on Apple
#include <React-Codegen/AppSpecsJSI.h>
#elif __has_include("AppSpecsJSI.h") // CMake headers on Android
#include "AppSpecsJSI.h"
#endif
#include <memory>
#include <string>

namespace facebook::react
{

  using ServerOptions = NativeWebsocketModuleBaseServerOptions<
    std::optional<std::string>,
    std::optional<int32_t>,
    std::optional<int32_t>>;

  template <>
  struct Bridging<ServerOptions>
      : NativeWebsocketModuleBaseServerOptionsBridging<
            std::optional<std::string>,
            std::optional<int32_t>,
            std::optional<int32_t>> {};

  class NativeWebsocketModule : public NativeWebsocketModuleCxxSpec<NativeWebsocketModule>
  {
  public:
    NativeWebsocketModule(std::shared_ptr<CallInvoker> jsInvoker);

    void createServer(jsi::Runtime &rt, const ServerOptions &options);
    void stopServer(jsi::Runtime &rt);
    void doSomething(jsi::Runtime &rt);
  };

} // namespace facebook::react
