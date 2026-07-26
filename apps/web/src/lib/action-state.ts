export interface ActionState {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
}

export const initialActionState: ActionState = {};
