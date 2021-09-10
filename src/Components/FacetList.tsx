import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Facet from "./Facet";

const FacetList = () => {
  return (
    <Box>
      <Box px={1} pb={1}>
        <Typography variant="overline">Filters</Typography>
        <Facet field="objecttype" title="Movie/Serie" />
        <Facet field="moviegenre" title="Genre" />
        <Facet field="movieactors" title="Actors" />
        <Facet field="moviewriter" title="Writer" />
        <Facet field="movieviewrating" title="Rating" />
      </Box>
    </Box>
  );
};

export default FacetList;
