export class RefreshContextDto {
  id: string;
  sessionId: string;
}

export type Nullable<T> = { [P in keyof T]: T[P] | null };