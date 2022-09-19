import { motion, AnimatePresence } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearchMovies, getSearchTv } from "../api";
import { makeImagePath } from "../utils";

interface Imovie {
  id: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  title: string;
}
export interface IGetMovieSearch {
  page: number;
  results: Imovie[];
  total_results: number;
  total_pages: number;
}

interface Itv {
  id: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  name: string;
}
export interface IGetTvSearch {
  page: number;
  results: Itv[];
  total_results: number;
  total_pages: number;
}

const movrowVariants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? window.innerWidth - 5 : -window.innerWidth - 5,
  }),
  visible: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -window.innerWidth - 5 : window.innerWidth - 5,
  }),
};
const tvrowVariants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? window.innerWidth - 5 : -window.innerWidth - 5,
  }),
  visible: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -window.innerWidth - 5 : window.innerWidth - 5,
  }),
};
const BoxVariant = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.4,
    y: -30,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};
const InfoVariant = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};

const offset = 6;

const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const [index, setIndex] = useState(0);
  const [tvindex, settvIndex] = useState(0);
  const { data: movieSearch, isLoading } = useQuery<IGetMovieSearch>(
    ["movieSearch", keyword],
    () => getSearchMovies(keyword)
  );
  const { data: tvSearch, isLoading: searchLoading } = useQuery<IGetTvSearch>(
    ["tvSearch", keyword],
    () => getSearchTv(keyword)
  );

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const [movdirection, setmovDirection] = useState(0);
  const [tvdirection, settvDirection] = useState(0);

  const movincraseIndex = () => {
    if (movieSearch) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieSearch?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setmovDirection(1);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const movdecraseIndex = () => {
    if (movieSearch) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieSearch?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setmovDirection(-1);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const tvincraseIndex = () => {
    if (tvSearch) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = tvSearch?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      settvDirection(1);
      settvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const tvdecraseIndex = () => {
    if (tvSearch) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = tvSearch?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      settvDirection(-1);
      settvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <Wrapper>
      <H2>
        <b>'{keyword}'</b>의 검색 결과
      </H2>

      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <H3>tv results</H3>
          <Sliders>
            <ArrowBtn
              onClick={movdecraseIndex}
              style={{
                left: 0,
                backgroundImage:
                  "linear-gradient(to left,rgba(0,0,0,0),rgba(0,0,0,1))",
              }}
            >
              〈
            </ArrowBtn>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={movdirection}
            >
              <Row
                variants={movrowVariants}
                custom={movdirection}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {movieSearch?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={BoxVariant}
                      custom={movdirection}
                      initial="noraml"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      layoutId={movie.id + ""}
                    >
                      <Info variants={InfoVariant}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <ArrowBtn
              onClick={movincraseIndex}
              style={{
                right: 0,
                backgroundImage:
                  "linear-gradient(to right,rgba(0,0,0,0),rgba(0,0,0,1))",
              }}
            >
              〉
            </ArrowBtn>
          </Sliders>
        </>
      )}
      {searchLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <H3>tv results</H3>
          <Sliders>
            <ArrowBtn
              onClick={tvdecraseIndex}
              style={{
                left: 0,
                backgroundImage:
                  "linear-gradient(to left,rgba(0,0,0,0),rgba(0,0,0,1))",
              }}
            >
              〈
            </ArrowBtn>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={tvdirection}
            >
              <Row
                variants={tvrowVariants}
                custom={tvdirection}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={tvindex}
              >
                {tvSearch?.results
                  .slice(1)
                  .slice(offset * tvindex, offset * tvindex + offset)
                  .map((tv) => (
                    <Box
                      key={tv.id}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      variants={BoxVariant}
                      custom={tvdirection}
                      initial="noraml"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      layoutId={tv.id + ""}
                    >
                      <Info variants={InfoVariant}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <ArrowBtn
              onClick={tvincraseIndex}
              style={{
                right: 0,
                backgroundImage:
                  "linear-gradient(to right,rgba(0,0,0,0),rgba(0,0,0,1))",
              }}
            >
              〉
            </ArrowBtn>
          </Sliders>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 80px 0;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const H2 = styled.h2`
  font-size: 32px;
  color: ${(props) => props.theme.white.lighter};
  b {
    font-weight: bold;
  }
  text-align: center;
  margin-bottom: 10px;
`;
const H3 = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Sliders = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  margin-bottom: 50px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  cursor: pointer;
  background-color: white;
  height: 150px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 5px 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 12px;
    color: white;
  }
`;

const ArrowBtn = styled.span`
  position: absolute;
  top: 0;
  height: 100%;
  width: 50px;
  z-index: 10;
  font-size: 60px;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
export default Search;
