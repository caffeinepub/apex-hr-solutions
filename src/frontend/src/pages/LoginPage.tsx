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
  XCircle,
} from "lucide-react";
import { useEffect } from "react";

export default function LoginPage() {
  const { navigate } = useRouter();
  const { isAuthenticated, isAdmin, isInitializing, refetchRole } = useAuth();
  const { login, clear, isLoggingIn, isLoginError, loginError, loginStatus } =
    useInternetIdentity();

  // Redirect only HR admins; non-admins stay on this page and see access denied
  useEffect(() => {
    if (!isInitializing && isAuthenticated && isAdmin) {
      navigate("/dashboard/hr");
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
              HR Admin Portal
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Secure access for HR administrators only
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-6">
            {/* Access Denied state -- authenticated but not HR admin */}
            {!isInitializing && isAuthenticated && !isAdmin ? (
              <div
                data-ocid="login.error_state"
                className="flex flex-col items-center gap-4 py-4"
              >
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">Access Denied</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This portal is restricted to HR administrators only.
                  </p>
                </div>
                <Button
                  data-ocid="login.cancel_button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    clear();
                    navigate("/");
                  }}
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Website
                </Button>
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  Looking for the{" "}
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      navigate("/portal/employee");
                    }}
                    className="text-primary underline hover:no-underline"
                  >
                    Employee Portal
                  </button>
                  ?
                </p>
              </div>
            ) : (
              <>
                {/* Login error */}
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

                    <div className="mt-6">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            HR Administrator Access
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Full employee management, payroll & leave control
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-center text-muted-foreground mt-5 leading-relaxed">
                      Looking for the{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/portal/employee")}
                        className="text-primary underline hover:no-underline"
                      >
                        Employee Portal
                      </button>
                      ?
                    </p>
                  </>
                )}
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
