import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase env keys are missing. Using localStorage fallback client.");
    const dummyQuery = () => {
      const builder: any = {
        select: () => builder,
        insert: () => Promise.resolve({ data: null, error: { message: "Supabase URL/Key missing" } }),
        delete: () => builder,
        update: () => builder,
        order: () => builder,
        eq: () => builder,
        neq: () => builder,
        then: (resolve: any) => resolve({ data: null, error: { message: "Supabase URL/Key missing" } }),
      };
      return builder;
    };
    return {
      from: dummyQuery,
    } as any;
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
};

export const formatError = (err: any): any => {
  if (!err) return "No error detail";
  if (typeof err === "string") return err;
  
  const obj: any = {};
  const propNames = Object.getOwnPropertyNames(err);
  for (const name of propNames) {
    obj[name] = err[name];
  }
  
  if (err.message) obj.message = err.message;
  if (err.details) obj.details = err.details;
  if (err.hint) obj.hint = err.hint;
  if (err.code) obj.code = err.code;
  
  if (Object.keys(obj).length === 0) {
    return String(err);
  }
  
  return obj;
};
