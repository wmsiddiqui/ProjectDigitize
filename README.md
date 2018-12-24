#Design Decisions
##Node dependancy injection VS imports
Unlike strongly typed languages, dependency injection is not necessarily the go-to solution. There are two main considerations to keep in mind:

1. **Testability**: This is probably the main reason that I would use dependency injection. Using DI allows us to pass in "test" or dummy dependencies. For example, when running tests, we can inject a dummy persistence module.
2. **Reusability**: Using import statements creates a "building block". This block can be reused elsewhere without having to inject the correct dependencies.

As a result, I will be using DI when there are resources that need to be abstracted away for looser coupling and easier testing. Other modules will be used as plain import statements.
