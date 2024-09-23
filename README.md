
# AI agents workflow builder

Minimal implementation of a AI agen workflow builder using Vite, Shadcn & ReactFlow
Check live here: 

## Run Locally

Clone the project

```bash
  git clone https://github.com/gagocarrilloedgar/workflow-builder
```

Go to the project directory

```bash
  cd workflow-builder
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm dev
```


## Running Tests

To run tests, run the following command

```bash
  pnpm dev
```


## Some considerations

- I have prioritised code structure, quality & user experience over a huge test coverage. I have focused on trying to make the UX fluid and clean using a quite popular trend of styling using Shadcn.

- Regarging UX I have taken inspiration from figma. I find figma quite intuitive and clean and the base layout has been created following the same patterns:
  - Main central area
  - Lateral left bar for navigation (in this case small so users don't lose focus)
  - Main editor to on the right that could be expanded for more comfort typing experience.

- Regargind code structure. I like to separate FE projects using:
  - *components/*: general shared components that could be re-used and are usually dummy
  - *pages*: I use this as the entry point for the different view. All the code related to that specific view(logic, styling) will be there (if it's not shared with others)
  - *modules*: This folder is for business logic and abstractions to make it easier for pages to consume apis in a way that is easy to mantain and test. In this folder we can find the use case layer (_application_), the infra layer (_infra_) where we do specific implementation of our repositories or ingestion use cases from the _domain_ layer where we define the contract, models and business logic validations that are common between use cases.

- Regarding testing. I'm using vitest mocking the infra layer as I believe integration tests are usually faster to write and develop that e2e.
- The testing strategy here is basically to make that if the infra layer works we can expect our app to have the correct behaviour. I've added also a unit test just to showcase a different type.
- Finally regarding the folder structure I like to use a replica of *src* for tests to give some predicatibility about naming, etc.

## Improvements

- We could improve error management adding some error boundary class inside the different routes and improve the experience.
- Add more integration test for the different cases we are expecting (failure and happy paths)
- For more resilient we could include *E2E* for the happy paths only.
- Generators for testing
- At the moment the state management is kind of tricky and `ReactFlow` does not recommend to use their on `state` hooks for procution, so we would need to migrate that and make sure that we implement the same handlers the library has by default so we don't loose functionality.
- Some components are a bit big so I'd improve that by using the `container` pattern so we cam make testing faster and more modular.
- Node editor panel could be improved a bit the visuals by adding tabs (similar figma pattern). We could remove the add nodes panel and place a floating bottom bar similar to Apple's navigation or Figjams sticker bars.