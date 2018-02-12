import { TemplateRouter } from "../lib/http/template-router";
import { Tables } from "../data/db-interface";

const Router = new TemplateRouter(
  {
    /** no custom options */
  },
  [
    /** no middleware */
  ]
);

Router.getFromRoute("/users/:id")
  .withParam("id") //matches route
  .withResponse(builder =>
    builder
      .string("id")
      .string("name")
      .string("email")
  )
  .withHandler(async (req, res) => {
    const user = await Tables.sample_users.qb.selectFirst({
      id: req.params.id
    });
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  });

Router.postToRoute("/users")
  .withBody(builder => builder.string("name").string("email"))
  .withResponse(builder =>
    builder
      .string("id")
      .string("name")
      .string("email")
  )
  .withHandler((req, res) => {
    console.log("creating example", req.body.email, req.body.name);
    return res.json({
      id: "123",
      email: "test@something.io",
      name: "tester"
    });
  });

Router.delAtRoute("/users/:id")
  .withParam("id") // to match :id
  .withResponse(builder => builder)
  .withHandler((req, res) => {
    return res.json({});
  });

// mountable express router
export const SampleRouter = Router.router;

// template router instance
// exported so definition can be extracted
export const SampleTemplateRouter = Router;
