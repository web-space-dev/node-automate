# Node Automate between Toggl Track & Plutio

### Description

I use [Toggl Track](https://toggl.com/) to track time for WebSpace projects, and I use [Plutio](https://www.plutio.com/) to invoice people for those billable hours. Manually adding these Toggl time entries into Plutio once a month was a headache and usually took a long time (Doesn't help that Plutio's UI for adding entries is a bit awkward).

So I built this server which does the following:

1. Fetches all entries from Toggl with the tag "To be billed"
2. Sorts through all the entries and organise them via Project
3. Turns them into a format that Plutio is familiar with
4. Creates a time entry on Plutio for each
5. Marks each Toggl entry as "Billed"

The server has two endpoints:

- `/api/billable` - Fetch all entries to be billed from Toggl and send them to Plutio
- `/api/clear` - Clears all unpaid entries in Plutio (because it's a pain to delete each one individually on Plutio)

### What you need to run this code

1. Node (17.4.0)
2. NPM (8.3.1)

> These versions are recommended but not obligitory, but should you have problems running the application you should ensure your versions match these.

### How to run this code

1. Clone this repository to your local machine.
2. You'll need both a Toggl and Plutio account.
3. Run `cp .env.example .env` and fill in the appropiate values
4. Run `npm install` to install the dependencies
5. Run `npm run dev` to run the application in development
6. Run `npm run build` to build the application
7. Run `docker-compose up` to run it as a Docker container
