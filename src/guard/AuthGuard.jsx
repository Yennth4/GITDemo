//   import { AccountAPI } from "../apis/account.api";
//   import { useAppDispatch, useAppSelector } from "../app/hooks";
//   import {
//     selectUser,
//     UpdateUser,
//     UserLogout,
//   } from "../app/reducers/Auth/Auth.reducer";
//   import GlobalLoading from "../components/global-loading/GlobalLoading";
  
//   import { getToken } from "../helper/userToken";
  
  const AuthGuard = ({ children, levels }) => {
    // const dispatch = useAppDispatch();
    // const currentUser = useAppSelector(selectUser);
    // const userToken = getToken();
  
    // const [isLoading, setIsLoading] = useState(true);
  
    // const getMe = () => {
    //   setIsLoading(true);
    //   AccountAPI.getMe()
    //     .then((result) => {
    //       dispatch(UpdateUser(result.data));
    //       setIsLoading(false);
    //     })
    //     .catch((err) => {
    //       setIsLoading(false);
    //       console.log("err", err);
    //     });
    // };
  
    // // get user info on start
    // useEffect(() => {
    //   getMe();
    //   // eslint-disable-next-line
    // }, []);
  
    // if (userToken.length === 0) {
    //   return <Navigate to="/login" />;
    // }
  
    // if (isLoading) {
    //   return <GlobalLoading />;
    // }
  
    // if (userToken) {
    //   if (levels && !levels.includes(currentUser?.typeRole as string)) {
    //     return <Navigate to="/layout-guard-roles" />;
    //   }
    //   if (currentUser?.activation === false) {
    //     dispatch(UserLogout());
    //   }
  
    //   return children as ReactElement;
    // }
  
    // return <Navigate to="/login" />;

    return children;
  };
  
  export default AuthGuard;
  