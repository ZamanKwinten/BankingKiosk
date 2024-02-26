import { useLayoutEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Bank } from "../banks/Types";
import { bankHomePage, getAccounts } from "../banks/API";
import { getAuth } from "../util/LocalStorageUtil";
import { LoadingIndicator } from "../components/LoadingIndicator";

type props = { bank: Bank };

const AuthWrapper = ({ bank }: props) => {
  const location = useLocation();
  const [auth, setAuth] = useState<Object | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const authCheck = async () => {
      setIsLoading(true);
      const auth = getAuth(bank);

      
      try {
        if (!auth) {
          setAuth(null); // or unauthorized value
          return;
        }

        await getAccounts(bank);
        setAuth(auth);
      } catch (error) {
        setAuth(null);
      } finally {
        setIsLoading(false);
      }
    };

    authCheck();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // <-- check authentication when route changes

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return auth ? ( // or auth property if object, i.e. auth.isAuthenticated, etc...
    <Outlet />
  ) : (
    <Navigate to={bankHomePage(bank)} replace />
  );
};

export default AuthWrapper;
