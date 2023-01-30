# rbxts-sleitnick-log
Types for Sleitnick's Log library

There are a few differences from the original library:

- This version supports a unique print function for the Info log level, using `TestService:Message`. You can enable it with `SetInfoLogEnabled`.
- I've removed the AnalyticsService support, as it's dead.
- I've fixed the get name function for stories.
