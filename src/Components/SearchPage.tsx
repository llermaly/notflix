import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SearchBox from "./SearchBox";
import QuerySummary from "./QuerySummary";
import CardList from "./CardList";
import SwipeResults from "./SwipeResults";
import Pager from "./Pager";
import Sort from "./Sort";
import FacetList from "./FacetList";
import ResultsPerPage from "./ResultsPerPage";
import {
  SearchEngine,
  buildResultList,
  ResultListOptions,
} from "@coveo/headless";
import { EngineProvider } from "../common/engineContext";
import Logo from "./notflix.png";
import "./SearchPage.css";

interface ISearchPageProps {
  engine: SearchEngine;
}

const SearchPage: React.FunctionComponent<ISearchPageProps> = (props) => {
  const { engine } = props;

  useEffect(() => {
    engine.executeFirstSearch();
  }, [engine]);
  const options: ResultListOptions = {
    fieldsToInclude: [
      "movieimage",
      "moviereleasedate",
      "movieactors",
      "moviegenre",
      "moviewriter",
      "moviescore",
      "movieruntime",
    ],
  };
  const controller = buildResultList(engine, { options });
  const [sickness, setSickness] = useState(Math.random().toString());

  return (
    <EngineProvider value={engine}>
      <Container maxWidth="lg">
        <div className="searchbox_wrapper">
          <img src={Logo} alt="Logo" /> <SearchBox />
        </div>
        <Grid container justifyContent="center">
          <Grid item md={8}></Grid>
        </Grid>

        <Grid container>
          <Grid item md={8}>
            <SwipeResults controller={controller} setSickness={setSickness} />
          </Grid>
        </Grid>
        <Grid item md={4}>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "265px" }}
            startIcon={<FavoriteIcon />}
            onClick={() =>
              alert(
                "This toggle to all the movies liked but I had no time to finish it, also liked movies will turn green after refresh :D"
              )
            }
          >
            Show Likes
          </Button>
        </Grid>
        <Box my={4}>
          <Grid container>
            <Grid item md={3} sm={12}>
              <FacetList />
            </Grid>
            <Grid item md={9} sm={12}>
              <Box pl={3}>
                <Grid container alignItems="flex-end">
                  <Grid item md={10}>
                    <QuerySummary />
                  </Grid>
                  <Grid item md={2}>
                    <Sort />
                  </Grid>
                </Grid>
                <CardList sickness={sickness} />
              </Box>
              <Box my={4}>
                <Grid container>
                  <Grid item md={6}>
                    <Pager />
                  </Grid>
                  <Grid item md={6}>
                    <ResultsPerPage />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </EngineProvider>
  );
};

export default SearchPage;
