import { ReactElement, ReactNode } from "react";

type Observer = (mask: string) => void;
export class MaskObservable {
  observers: Observer[];
  constructor() {
    this.observers = [];
  }

  addObserver(callback: Observer) {
    this.observers.push(callback);
  }

  notify(mask: string) {
    this.observers.forEach((fn) => {
      fn(mask);
    });
  }
}

export type LoginStepReturn = {
  display: ReactElement;
  metadataForLogin?: Object;
  maskObservable?: MaskObservable;
};

export abstract class LoginStep {
  abstract render(): Promise<LoginStepReturn>;
}

export class TextStep extends LoginStep {
  text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }

  render(): Promise<LoginStepReturn> {
    return Promise.resolve({ display: <span>{this.text}</span> });
  }
}

export class IconStep extends LoginStep {
  text: string;
  icon: string;
  constructor(text: string, icon: string) {
    super();

    this.text = text;
    this.icon = icon;
  }

  render(): Promise<LoginStepReturn> {
    return Promise.resolve({
      display: (
        <>
          {this.text}{" "}
          <img style={{ paddingLeft: "15px" }} src={this.icon} alt="icon"></img>
        </>
      ),
    });
  }
}
export type iconStyle = { size: string };
export interface Bank {
  label: string;
  spotColor: string;
  icon: (style: iconStyle) => ReactNode;
  loginSteps: LoginStep[];
  cardReader: string;
}

export type Account = {
  accountName: string;
  iban?: string;
  type: string;
  balance?: number;
  availableBalance?: number;
};

export type Transaction = {
  date: string;
  counterPartyName: string;
  counterPartyIBAN?: string;
  amount: number;
  comment: string;
};
