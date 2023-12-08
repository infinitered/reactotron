require "json"

package = JSON.parse(File.read(File.join(__dir__, "../package.json")))

Pod::Spec.new do |s|
  s.name            = "AppTurboModules"
  s.version         = package["version"]
  s.summary         = package["description"] || "AppTurboModules"
  s.description     = package["description"] || "AppTurboModules"
  s.homepage        = package["homepage"] || "AppTurboModules"
  s.license         = package["license"] || "MIT"
  s.platforms       = { :ios => "12.4", :osx => "10.15" }
  s.author          = package["author"]
  s.source          = { :git => package["repository"], :tag => "#{s.version}" }
  s.source_files    = "**/*.{h,cpp}"
  s.pod_target_xcconfig = {
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
  }
  install_modules_dependencies(s)
end