// react-hook-form's useFieldArray only works on arrays of objects, not
// arrays of primitives — these convert plain string[] (the actual wire/DB
// shape) to/from the {value: string}[] shape StringListField edits.
export type StringListItem = { value: string };

export function toStringListValue(items: string[] | undefined): StringListItem[] {
  return (items ?? []).map((value) => ({ value }));
}

export function fromStringListValue(items: StringListItem[] | undefined): string[] {
  return (items ?? []).map((item) => item.value);
}
