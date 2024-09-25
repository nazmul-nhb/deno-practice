interface Person {
	name: string;
	age: number;
}

const greet = (person: Person): string => {
	return "Hello, " + person.name + "!";
}

const alice: Person = {
	name: "Alice",
	age: 36,
};

console.log(greet(alice));
