# Design Decisions
## Node dependancy injection VS imports
Unlike strongly typed languages, dependency injection is not necessarily the go-to solution. There are two main considerations to keep in mind:

1. **Testability**: This is probably the main reason that I would use dependency injection. Using DI allows us to pass in "test" or dummy dependencies. For example, when running tests, we can inject a dummy persistence module.
2. **Reusability**: Using import statements creates a "building block". This block can be reused elsewhere without having to inject the correct dependencies.

As a result, I will be using DI when there are resources that need to be abstracted away for looser coupling and easier testing. Other modules will be used as plain import statements.

## Redis vs MongoDB
Redis gives speed, mongo gives a loosly defined schema and JSON documents. However, ReJson allows redis to store JSON data, is incredibly easy to set up with Docker, and is fast compared to MongoDB.

There might be a tradeoff if/when we need to scale out, but for now iorejson will serve our needs.

ReJson also allows for updates to part of the object, which means we won't need to update the entire object, just the fields that change. For our purposes, immutable data such as type, ID, etc. will remain the same. The resources will change, so any change will just update those properties directly instead of having to explicitly update the entire object.

Concurrency might be an issue with Redis, so we'll have to use some kind of versioning system. 
