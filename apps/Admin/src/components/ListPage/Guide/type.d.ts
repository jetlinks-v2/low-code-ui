export type GuideProps = {
  stepsList: StepListProps[]
}


type StepListProps = {
  title: string;
  description?: string;
  placement?: string;
  target: () => TargetProps[];
}

type TargetProps = {
  el: HTMLElement;
  overText?: string;
  backgroundColor?: string;
}