import React, { useEffect, useRef } from "react"
import styled from "styled-components"

const JokeSetup = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
  font-weight: bold;
`
const JokePunchline = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
  font-style: italic;
  margin-top: 5px;
`

const jokes = [
  {
    setup: "Why was the JavaScript developer sad?",
    punchline: "Because he didn't Node how to Express himself.",
  },
  {
    setup: "How does a debugger break up a fight?",
    punchline: "It steps in.",
  },
  {
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs!",
  },
  {
    setup: "Why did the developer go broke?",
    punchline: "Because he lost his domain in a bet!",
  },
  {
    setup: "Why did the programmer quit his job?",
    punchline: "Because he didn't get arrays!",
  },
  {
    setup: "How do you comfort a JavaScript bug?",
    punchline: "You console it.",
  },
  {
    setup: "Why don't programmers like nature?",
    punchline: "It has too many bugs.",
  },
  {
    setup: "What's a debugger's favorite music?      ",
    punchline: "Break beats",
  },
  {
    setup: "Why don't debuggers get along with compilers?",
    punchline: "They always point out each other's mistakes.",
  },
  {
    setup: "Why was the debugger bad at hide and seek?",
    punchline: "It always showed where the bugs were hiding.",
  },
]

export function RandomJoke() {
  const jokeRef = useRef(0)

  useEffect(() => {
    const ref = Math.floor(Math.random() * jokes.length)
    jokeRef.current = ref
  }, [])

  return (
    <>
      <JokeSetup>{jokes[jokeRef.current].setup}</JokeSetup>
      <JokePunchline>{jokes[jokeRef.current].punchline}</JokePunchline>
    </>
  )
}
