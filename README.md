# hubot-lunchplans

Make some lunch plans with your pals.

## Installation

In your hubot project repo, run:

`npm install hubot-lunchplans --save`

Then add **hubot-lunchplans** to your `external-scripts.json`:

```json
[
  "hubot-lunchplans"
]
```

## Available commands

```
hubot lunchplans list - Lists all of today's lunch plans.
hubot lunchplans add <text> - Adds you to a lunch plan.
hubot lunchplans with <username> - Adds you to another user's lunch plans.
hubot lunchplans never mind - Removes you from any lunch plans.
```

## Sample Interaction

```
user1>> hubot lunchplans list
hubot>> No one has any lunch plans today.
user1>> hubot lunchplans add Subway on Broadway at 11:30 am
hubot>> Subway on Broadway at 11:30 am: user1
user2>> hubot lunchplans with user1
hubot>> Subway on Broadway at 11:30 am: user1, user2
user1>> hubot lunchplans never mind
hubot>> Subway on Broadway at 11:30 am: user2
user3>> hubot lunchplans add Chipotle at 12:45 pm
hubot>> Chipotle at 12:45 pm: user3
user3>> hubot lunchplans list
hubot>> Subway on Broadway at 11:30 am: user2
        Chipotle at 12:45 pm: user3
```
