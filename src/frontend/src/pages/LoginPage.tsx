import { useRouter } from "@/App";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect } from "react";

export default function LoginPage() {
  const { navigate } = useRouter();
  const { isAuthenticated, isAdmin, isInitializing, refetchRole } = useAuth();
  const { login, isLoggingIn, isLoginError, loginError, loginStatus } =
    useInternetIdentity();

  // Redirect after successful authentication
  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      if (isAdmin) {
        navigate("/dashboard/hr");
      } else {
        navigate("/dashboard/employee");
      }
    }
  }, [isAuthenticated, isAdmin, isInitializing, navigate]);

  // Trigger role check when login succeeds
  useEffect(() => {
    if (loginStatus === "success") {
      void refetchRole();
    }
  }, [loginStatus, refetchRole]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Back to site */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/uploads/Apex-HR-Solutions-logo-design-1.png"
            alt="Apex HR Solutions"
            className="h-14 w-auto object-contain brightness-0 invert"
          />
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
          <CardHeader className="text-center pb-2 pt-8 px-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl text-foreground">
              Secure Portal Login
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Sign in with Internet Identity to access the HR portal
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-6">
            {/* Error state */}
            {isLoginError && (
              <Alert
                data-ocid="login.error_state"
                variant="destructive"
                className="mb-6"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {loginError?.message ?? "Login failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading state while initializing */}
            {isInitializing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground text-sm">
                  Loading...
                </span>
              </div>
            ) : (
              <>
                {/* Login Button */}
                <Button
                  data-ocid="login.submit_button"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="w-full h-12 text-base font-semibold shadow-md"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 w-4 h-4" />
                      Login with Internet Identity
                    </>
                  )}
                </Button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        HR Administrator
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Full portal access
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Employee
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Self-service dashboard
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed">
                  Internet Identity is a secure, anonymous authentication system
                  for the Internet Computer. No passwords needed.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-white/50 text-xs mt-6">
          © {new Date().getFullYear()} Apex HR Solutions · Secure Access
        </p>
      </div>
    </div>
  );
}
