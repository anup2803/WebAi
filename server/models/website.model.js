import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["ai", "user"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const websiteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Website",
    },
    latestCode: {
      type: String,
      required: true,
    },
    conversation: [messageSchema],
    deployed: {
      type: Boolean,
      default: false,
    },
    deployedUrl: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
    },
  },
  { timestamps: true },
);

// Pre-save hook to generate slug if missing
websiteSchema.pre('save', async function() {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
  // no next() needed in async
});

// Model
const Website = mongoose.model("Website", websiteSchema);

export default Website;
