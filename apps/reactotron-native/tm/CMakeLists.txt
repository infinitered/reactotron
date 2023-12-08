cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

add_compile_options(
        -fexceptions
        -frtti
        -std=c++17)

file(GLOB tm_SRC CONFIGURE_DEPENDS *.cpp)
add_library(tm STATIC ${tm_SRC})

target_include_directories(tm PUBLIC .)
target_include_directories(react_codegen_AppSpecs PUBLIC .)

target_link_libraries(tm
        jsi
        react_nativemodule_core
        react_codegen_AppSpecs)