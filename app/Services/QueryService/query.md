# Writing queries.

The is 2 mains ways to write a query for sending request to the backend.

-   Low level approach that represent the query as it will be send to the api.
-   High level approach that is more readable a convert to the low level before being send to the server.

The query that is save into model definition is the low level. So when we set a model query we actually send the low level one. Indeed the high level query is always convert into the low level approach.

## Low level

This is an example of query that embodies most of the user cases an params that we can provide to a query.

```js
{
  user: {
    clauses: [
      {
        name: "where",
        value: ["gender", "male"],
      },
      {
        name: "where",
        value: ["age", ">", 30],
      },
      {
        name: "where",
        value: [
          {
            name: "orWhere",
            value: ["job", "developper"],
          },
          {
            name: "orWhere",
            value: ["city", "douala"],
          },
        ],
      },
    ],
    computed: {
      fullname: [],
      expenses: ["2024-10-01","2024-11-01"]
    },
    order: [
      ["age","desc"]
    ],
    paginate: [1,20],
    select: ["firstname", "lastname", "age", "area"],
    rels: {
      children: {
        select: ["age", "gender"]
      }
    }
  }
}
```

In this query we ge the list of all user male developper or living in douala pass 30, sort them by age descendant, select thier the firstname, lastname age and area. Also we fetch their children and their age.

In this we can identify their parameters:

-   `clauses` to express the conditions
-   `computed` to express the computed attribute, the one that are not save into the database directly.
-   `order` order the value by age descend
-   `paginate` paginate the result going to page from page `1` to page `20`
-   `select` Define the field that we select
-   `rels` load the relationships of the model User. In the example we easily assume that there is child model. And we can use the same rules as above inside the `children` object to query the children associate to the user as we where doing a subquery.

It's another parameter that we have not use here. `limit` to limit the numbers of items to fetch. Actually we do not use `limit` `paginate`. Either paginate or limit not both at the same time.

```js
{
  user: {
    ...
    limit: 10,
    ...
  }
}
```

We can also want to select all attributes of the user as we have into the database of the api.

```
{
  user: {
    ....
    select: ['*']
    ...
  }
}
```

## High Level

Now the are going to write the same request but now using the high level approach. The idea of the is way is to provide something more readable, easy to understand and human friendly that can be convert into the low level one. So this how the above request will look like.

```js
{
  user: {
    gender : "male",
    age: greaterThan(30).order("desc"),
    job: "developper",
    city: "douala",
    expenses: compute("2024-10-01","2024-11-01"),
    firstname: "",
    lastname: "",
    area: "",
    fullname: compute(),
    children: rel({
      age: "",
      gender: ""
    })
    _paginate: [1,20],
  }
}
```

You see this approch is more simple. The philosophie behind this is to make sur to get only what we one an to save a structure that show exactly what are going to have.

Let take a closer look to some points.

-   The is no more a select rule, we have directly put all the fields that we want to select into a object definition. We structure the object so that it represent one we are willing to get from the api. But what if want not to get the job and city. Because the idea is that when a field appear into the object definition it is directly add to the select list. The point is what if the attribute should be use for the clause but should not appear into the result. The Api can auto filter the result. But also in the client side we can force the select list like follow:

```js
_select: ["firstname", "lastname", "age", "area"];
```

And if we want to select all attributes

```js
_select: ["*"];
```

We can also write it like this

```js
_: select().
```

`_` is a particular key that is use for rule like `select`, `limit` , and `paginate` to provide another way to write theses is we don't want them to be written as attribute.

```js
_: paginate(1,2),
_: limit(1)
_: select()
```

And it's clear that we can't use the tree at the same time.
So that is.

# Handling and running the query.

## General Principles

This system is build on top of the eloquent query builder. So we model and relationships. So have theses simples convention.

-   `model` always refer to the model name. Like `User`, `Post`. The model name is use to talk about a particular resource and to define permission. So it's required for permission verification. So if use say `User` we are talking about the resource or the information thoerically. It does not refer to model instance that hold property it refer just to the idea or the concept of User.
-   `modelClass` refer to the class for that `User` the callback string. For model `User` the `modelClass` will be `App\Models\User` by default. It's a string but we call use the way PHP allow class name to be use.

## QueryController

The `QueryController` is responsible for intercepting the request. Defining the model that maybe involve in the request and send the request the query runner.
We can define many request context. A request context simply define the model that maybe use. By default we load all the models. But this it's not a mandentory approach since it maybe slow.

## The Query class

The `Query` is in charge of parsing the query sent by the client, checking permissions, and filtering access so the user can only access what they’re allowed to on the model. To get how this works, it’s important to understand the anatomy of a query.

Let’s say we receive something like this from the client:

```js
{
    'user': {},
    'posts': {}
}
```

Here, we’re trying to query data from both `user` and `posts`. You’ll notice that `posts` is plural while `user` is singular. Doesn’t matter. The `Query` will normalize all the query keys into **singular form**. So `posts` becomes `post`, and `users` becomes `user`.

### Why do we convert to singular?

Because the system loads models using a **map table** where each key is the name of a model in **singular lower snake_case**. So to match the model definition, we convert all query keys to follow that format.

The conversion logic uses **English language rules** (plural to singular, kebab-case to snake_case). If you're working in another language, there's support for that too — just use the inflector helper and customize as needed.

---

### Why do clients send queries in plural?

That’s a key part of this whole setup.

In most frontend apps — especially ones following **RESTful API design** — the convention is to use **plural resource names** when making requests. For example, when querying users, the frontend will hit an endpoint like `/api/users`. Same thing for posts: `/api/posts`.

So the index name in the API is plural by design, because it represents a **collection of resources**. And since the frontend knows and uses only the resource system, the query keys coming from the client will naturally be in plural form.

But the backend (your models) expect singular names. That’s where the `Query` class bridges the gap — it takes the resource-style keys (plural, often kebab-case) and turns them into the format your backend expects (singular, snake_case).

### Example: Name conversion in action

Here’s how a few sample keys might get converted by the `Query`:

-   `users` → `user`
-   `user-profiles` → `user_profile`
-   `posts` → `post`

Then in your `QueryController`, you’d load models like this:

```php
$this->queryService->setModels([
    "user" => \App\Models\User::class,
    "user_profile" => \App\Models\UserProfile::class,
    "post" => \App\Models\Post::class,
]);
```

So by the time the query runs, the system already knows which model to use and the query key is in the right format.

**IMPORTANT**: The query should always contains attributes that are involve into relation if we want to load a relation of a model.

### The response

The query will always return a list of items.

### Processing the query

**Permission: PermissionGuard**

For a query we request attributes, relations and computed attributes. The permission guard filter the query definition against the permissions to be sure we have the rights permissions for the informations we need. Here we are concerns by the `view` permissions for the attributes present in the `select`,`computed` members of the query and the relations. The permission guard also search for the `queryFilters` and added to query. The `queryFilters` can be define on the model and on the relation.

**Important**: We should always grand permissions for attributes that are use as foreign keys and then involve into the relation.

**Building: EloquentBuilder**

Once the permission is parsed by the guard. We then build the query using the eloquent builder. We look for the `clauses`, `order`, `limit`. We load the relations. We use eager loading for the relations.

**Running: QueryRunner**
At the end we run the query buy the query runner.
