import { useQuery } from "react-query";
import styled from "styled-components";
import { getTv } from "../api";
import Slider from "../Components/Slider";
import TvSlider from "../Components/TvSlider";
import { makeImagePath, TvCurrent } from "../utils";

interface ITv {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

const TV = () => {
  const { data, isLoading } = useQuery<IGetTvResult>(["tv", "popular"], () =>
    getTv("popular")
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].poster_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <TvSlider category={TvCurrent.on_the_air} />
          <TvSlider category={TvCurrent.airing_today} />
          <TvSlider category={TvCurrent.popular} />
          <TvSlider category={TvCurrent.top_rated} />
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
  word-break: keep-all;
`;

export default TV;
