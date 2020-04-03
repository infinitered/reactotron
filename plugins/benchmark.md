<!-- UPDATE  -->
# Benchmarking

If you have a function you believe is slow, you can benchmark it to find any bottlenecks like this:

```js
function slowFunction() {
  const bench = Reactotron.benchmark("slow function benchmark")

  // Code that does thing A
  bench.step("Thing A")

  // Code that does thing B
  bench.step("Thing B")

  // Code that does thing C
  bench.stop("Thing C")
}
```

Note that the last call is to `stop` instead of `step`! This is important because otherwise the benchmark results won't display in Reactotron.

When `slowFunction` is invoked, Reactotron should show something like this:

<!-- TODO: Fix -->
<!-- ![Benchmarking Output](./images/benchmarking/benchmark-output.png) -->

Tips: Time bar `Thing B` is the code execution time from `bench.step("Thing A")` to `bench.step("Thing B")`.


