# To don't (todont)

todont is an app for breaking bad habits or remembering to not do some things. Yes, it's a little tongue-in-cheek compared to a todo-app in that in a todo-app you list things that you should do and you start with an unchecked item and possibly a due date. In the todont-app you start with a checked item and a date on which you are allowed to uncheck the item if you have not done it.

## User problem

People struggle with things that they are doing that they should not do in different contexts. At home you may struggle with not eating cand or not watching TV all night long. At work you might struggle with doing things that should not be done or should not take precedence over other important tasks. Every so often it's easy to lose track not of the items that you should do but also of the items that you should not do. The purpose of the todont-list is to provide a reminder of the things that you should not perform and track them so that you don't forget to not do them.

## User stories

### Create a todont-list

A user should be able to create a todont-list and give it a descriptive name. Once created the todont-list will be given a unique url, http://todont.io/l/Hr4d5 which the user must remember or bookmark to maintain access to the todont-list.

### Create a todont-item

A user should be able to create a todont-item in the todont-list. The todont-item should have a description (a single line of text) and an optional "avoid until" date. The item will created as an item in the todont-list and will start to have the state checked. If it has a avoid until-date, the date will visible next to the description.

### Check and uncheck a todont-item

A todont-item can be either checked or unchecked and either active or inactive. An item is active as long as it is checked, it will become inactive when it is unchecked and it's avoid until date has passed. If it does not have an avoid until date then it becomes immediately inactive when it's unchecked. Active items are rendered as regular text in the list while inactive items are rendered in italics and in lighter gray shades. 

A user can check and uncheck a todont-item, its new state should be stored automatically.

### View todont-list

A user that loads the page with their list, e.g. http://todont.io/l/Hr4d5 should be shown their todont-list. If someone visits a list that does not exist they should get a not found message and be asked if they want to create a list.

## Tech stack

The todont-list should be built with a dotnet-backend and a react-frontend.
