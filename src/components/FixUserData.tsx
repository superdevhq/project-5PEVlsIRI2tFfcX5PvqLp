
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function FixUserData() {
  const { fixUserData, userType } = useAuth();
  const [isFixing, setIsFixing] = useState(false);

  const handleFixUserData = async () => {
    setIsFixing(true);
    try {
      await fixUserData();
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-muted rounded-md">
      <h3 className="text-sm font-medium mb-2">Having trouble logging in?</h3>
      <p className="text-xs text-muted-foreground mb-3">
        If you're being redirected to the wrong dashboard, click the button below to fix your account type.
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleFixUserData}
        disabled={isFixing}
        className="w-full"
      >
        {isFixing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Fixing...
          </>
        ) : (
          'Fix My Account'
        )}
      </Button>
      {userType && (
        <p className="text-xs text-center mt-2">
          Current account type: <span className="font-medium">{userType}</span>
        </p>
      )}
    </div>
  );
}
