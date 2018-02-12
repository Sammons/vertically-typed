import * as React from "react";
import * as ReactDOM from "react-dom";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Client, RestUser } from "./rest/client";

class PrimaryStore {
  @observable user: RestUser = null;
}

@observer
class App extends React.Component<{ s: PrimaryStore }, {}> {
  async makeSomeUser() {
    try {
      const user = await Client.createUser({
        email: "test@something.io",
        name: "Name"
      });
      this.props.s.user = user;
    } catch (e) {
      console.log("error", e.message);
    }
  }
  render() {
    if (!this.props.s.user) {
      return (
        <div>
          Hello<button onClick={() => this.makeSomeUser()}>Click Me</button>
        </div>
      );
    }
    return <div>Hello {this.props.s.user.name}</div>;
  }
}

const renderAll = () => {
  ReactDOM.render(
    <App s={new PrimaryStore()} />,
    document["getElementById"]("root")
  );
};

export default renderAll();
