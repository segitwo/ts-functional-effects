import { none } from 'fp-ts/Option'

const readline = require('readline-sync')

class Console<A> {
	constructor(public run: () => A) { }

	map<B>(f: (a: A) => B): Console<B> {
		return this.flatMap(a => new Console(() => f(a)))
	}

	flatMap<B>(f: (a: A) => Console<B>): Console<B> {
		return new Console(() => f(this.run()).run())
	}

	static println(str: string): Console<void> { return new Console<void>(() => console.log(str)) }
	static readline(): Console<string> { return new Console<string>(() => { return readline.question("") }) }
}

const greeting =
	Console.println("What is your name?")
		.flatMap(_ => Console.readline()
			.flatMap(name => Console.println(`Hi ${name}!`)
				.map(() => none)))

const age =
	Console.println("How old are you?")
		.flatMap(_ => Console.readline()
			.flatMap(age => Console.println(`Oh ${age} years, it's cool!`)))
		.map(() => none)


export const dialog = greeting.flatMap(_ => age.map(_ => none))