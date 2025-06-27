import { Notify } from "quasar";

export function notifyErrorRequest(msg) {
  Notify.create({
    color: "negative",
    message: msg,
    icon: "error",
    position: "top",
    timeout: 4500,
  });
};

export function notifySuccessRequest(msg) {
  Notify.create({
    color: "positive",
    message: msg,
    icon: "check",
    position: "top",
    timeout: 3500,
  });
};


export function notifyWarningRequest(msg) {
  Notify.create({
    color: "warning",
    message: msg,
    icon: "warning",
    textColor: "black",
    position: "top",
    timeout: 18000,
  });
}