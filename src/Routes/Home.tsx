import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies } from "../api";
import Slider from "../Components/Slider";
import { makeImagePath, MovieCurrent } from "../utils";

interface IMovie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

const Home = () => {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "now_playing"],
    () => getMovies("now_playing")
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].poster_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider category={MovieCurrent.now_playing} />
          <Slider category={MovieCurrent.popular} />
          <Slider category={MovieCurrent.top_rated} />
          <Slider category={MovieCurrent.upcoming} />
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #000;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  padding: 60px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 58px;
  margin-bottom: 20px;
`;
const Overview = styled.div`
  font-size: 20px;
  width: 60%;
`;

export default Home;
