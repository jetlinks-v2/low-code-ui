import { InjectionKey, Ref } from "vue";

export type BtnProps = {
  title: string;
  type: string;
  icon: string;
  script: string;
}

export type OperationConfigTreeItem = {
  title: string;
  type: string;
  icon: string;
  script: string;
  key: string;
  functions?: string;
  command?: string;
  children: OperationConfigTreeItem[];
  level?: number;
  pages?: string;
}

export type ErrorItemType = {
  errorKey: string;
  message: string;
  key: string;
}