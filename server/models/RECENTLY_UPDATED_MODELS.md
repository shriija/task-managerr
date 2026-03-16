# Recently Updated Models

## Activity.js

```js
import { Schema, model } from "mongoose";

//Activity Schema
const activitySchema = new Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      required: [true, "Board ref is required"],
      ref: "Board",
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ref is required"],
      ref: "User",
    },
    action: {
      type: String,
      required: [true, "Action is required"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
    timestamps: true,
  },
);

export const Activity = model("Activity", activitySchema);
```

## Board.js

```js
import { Schema, model } from "mongoose";

//Board schema
const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: [true, "Title cannot have leading or trailing spaces"],
      maxLength: [100, "Maxlength for title is 100"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "Owner is required"],
      ref: "User",
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    background: {
      type: String,
      default: "#0052cc",
    },
  },
  {
    strict: true,
    timestamps: true,
  },
);

export const Board = model("Board", boardSchema);
```

## Card.js

```js
import { Schema, model } from "mongoose";

//Card schema
const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: [true, "Title cannot have leading or trailing spaces"],
      maxLength: [200, "Maxlength for title is 200"],
    },
    desc: {
      type: String,
      default: "",
    },
    list: {
      type: Schema.Types.ObjectId,
      required: [true, "List ref is required"],
      ref: "List",
      index: true,
    },
    assignees: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    attachments: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    position: {
      type: Number,
      required: [true, "Position is required"],
    },
    labels: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
    timestamps: true,
  },
);

export const Card = model("Card", cardSchema);
```

## List.js

```js
import { Schema, model } from "mongoose";

//List schema
const listSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    board: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Board",
      index: true,
    },
    position: {
      type: Number,
      required: true,
    },
    cards: {
      type: [Schema.Types.ObjectId],
      ref: "Card",
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
    timestamps: true,
  },
);

export const List = model("List", listSchema);
```

## User.js

```js
import { Schema, model } from "mongoose";

//User Schema
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" },
  },
  { strict: true, timestamps: true },
);

export const UserModel = model("User", userSchema);
```