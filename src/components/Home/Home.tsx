// import { Box, Typography } from "@mui/material";
// import { useAuth } from "../../context/AuthContext";
// import { Link } from "react-router-dom";
// import styles from "./index.module.scss";

const Home = () => {
  // const { user, isAuthenticated } = useAuth();
  return (
    <div>
      {/* {isAuthenticated ? (
        <>
          <div>Welcome,{user?.email}</div>
          <div className={styles.hero}>
            <p className={styles["hero-text"]}>
              It's more than
              <br /> just a trip
            </p>
          </div>
        </>
      ) : (
        <Box>
          <Typography>Welcome, your not login</Typography>
          <div className={styles.hero}>
            <p className={styles["hero-text"]}>
              It's more than
              <br /> just a trip
            </p>
          </div>
          <Typography>
            <Link to="/RegistrationForm">Register?</Link>
          </Typography>
        </Box>
      )} */}
    </div>
  );
};

export default Home;
