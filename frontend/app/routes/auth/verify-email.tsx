// Page for verifying a user's email address

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/hooks/use-auth";
import { toast } from "sonner";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending: isVerifying } = useVerifyEmailMutation();

  // Gets the token from the URL
  const token = searchParams.get("token");

  // When the component loads, attempts to verify the email using the token
  useEffect(() => {
    if (token) {
      mutate(
        { token },
        {
          onSuccess: () => {
            setIsSuccess(true);
          },
          onError: (error: any) => {
            const errorMessage =
              error.response?.data?.message || "An error occured";
            setIsSuccess(false);
            console.log(error);

            toast.error(errorMessage);
          },
        }
      );
    }
  }, [searchParams]);

  // Renders UI based on verification status
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Verify Email</h1>
      <p className="text-sm text-gray-500">Verifying your email...</p>

      <Card className="w-full max-w-md">
        <CardHeader>
          <Link to="/sign-in" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign in
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            {isVerifying ? (
              // Shows loading spinner while verifying
              <>
                <Loader className="w-10 h-10 text-gray-500 animate-spin" />
                <h3 className="text-lg font-semibold">Verifying email...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email.
                </p>
              </>
            ) : // Shows success message if verified
            isSuccess ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500"></CheckCircle>
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500">
                  Your email has been verified successfully.
                </p>
              </>
            ) : (
              // Shows error message if verification failed
              <>
                <CheckCircle className="w-10 h-10 text-red-500"></CheckCircle>
                <h3 className="text-lg font-semibold">
                  Email Verification Failed
                </h3>
                <p className="text-sm text-gray-500">
                  Your email verification failed. Please try again.
                </p>

                <Link to="/sign-in" className="text-sm text-blue-500 mt-6">
                  <Button variant="outline">Back to Sign in</Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;
