import * as React from "react";
import { render } from "react-dom";

import "./patch";

import { Browser } from "./application/component/page/browser/Browser";

render(<Browser />, document.getElementById("root"));
