import ShikiCode from "@/components/ShikiCode";

const TsDiscriminatedUnionsBody = () => (
  <>
    <p>
      A common smell: a single type with optional <span className="font-mono">data</span>,
      <span className="font-mono">error</span>, and{" "}
      <span className="font-mono">loading</span> flags. The compiler can't
      tell you which combinations are valid, so you guard at every read site.
    </p>
    <ShikiCode
      language="ts"
      code={`// ❌ All four flag combinations compile — three are nonsense
type Bad = { loading: boolean; data?: User; error?: Error };

// ✅ Only three states exist; the discriminator narrows them
type Result =
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: Error };

function render(r: Result) {
  if (r.status === "loading") return <Spinner />;
  if (r.status === "error")   return <Err msg={r.error.message} />;
  return <Profile user={r.data} />; // data is guaranteed here
}`}
    />
    <p>
      Bonus: pair this with an <span className="font-mono">assertNever</span>{" "}
      helper in your default branch and TS will fail the build the moment
      you add a fourth state without handling it everywhere.
    </p>
  </>
);

export default TsDiscriminatedUnionsBody;
