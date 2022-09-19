import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeImagePath, MovieCurrent } from "../utils";
import { useQuery } from "react-query";
import { IGetMoviesResult } from "../Routes/Home";
import { getCredit, getMovies } from "../api";
import { useMatch } from "react-router-dom";

interface Icast {
  name: string;
}

interface Icrew {
  name: string;
}

interface ICreditData {
  id: number;
  cast: Icast[];
  crew: Icrew[];
}

const rowVariants = {
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

const Slider = ({ category }: { category: MovieCurrent }) => {
  const { data } = useQuery<IGetMoviesResult>(["movies", category], () =>
    getMovies(category)
  );

  const { scrollY } = useScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 50);

  const bigMovieMatch = useMatch(`/React_netflix/movies/${category}/:movieId`);
  const history = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const [direction, setDirection] = useState(0);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setDirection(1);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setDirection(-1);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const onBoxClicked = (category: string, movieId: number) => {
    history(`/React_netflix/movies/${category}/${movieId}`);
  };
  const { data: creditData } = useQuery<ICreditData>(
    ["moviecredit", bigMovieMatch?.params.movieId],
    () => getCredit(bigMovieMatch?.params.movieId),
    { enabled: !!bigMovieMatch?.params.movieId }
  );

  const onOverlayClick = () => {
    history(`/React_netflix/`);
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  return (
    <>
      <H3>{category}</H3>
      <Sliders>
        <ArrowBtn
          onClick={decraseIndex}
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
          custom={direction}
        >
          <Row
            variants={rowVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={category + index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  key={category + movie.id}
                  bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  variants={BoxVariant}
                  custom={direction}
                  initial="noraml"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(category, movie.id)}
                  layoutId={category + movie.id + ""}
                >
                  <Info variants={InfoVariant}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <ArrowBtn
          onClick={incraseIndex}
          style={{
            right: 0,
            backgroundImage:
              "linear-gradient(to right,rgba(0,0,0,0),rgba(0,0,0,1))",
          }}
        >
          〉
        </ArrowBtn>
      </Sliders>
      <AnimatePresence>
        {bigMovieMatch && (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              style={{ top: setScrollY }}
              layoutId={category + bigMovieMatch.params.movieId + ""}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>
                    <b>{clickedMovie.release_date.slice(0, 4)}</b> |{" "}
                    <b>★ {clickedMovie.vote_average}</b>
                    <br />
                    <br />
                    <span>
                      Cast :{" "}
                      {creditData?.cast
                        .splice(0, 3)
                        .map((prop) => prop.name + ", ")}
                    </span>
                    <br />
                    <span>
                      Crew :{" "}
                      {creditData?.crew
                        .splice(0, 3)
                        .map((prop) => prop.name + ", ")}
                    </span>
                    <br />
                    <br />
                    {clickedMovie.overview}
                  </BigOverview>
                </>
              )}
            </BigMovie>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
const H3 = styled.h3`
  position: relative;
  top: -110px;
  font-size: 30px;
  color: #fff;
  font-weight: bold;
  padding: 0 20px;
  box-sizing: border-box;
  margin-top: 30px;
`;
const Sliders = styled.div`
  position: relative;
  top: -100px;
  width: 100%;
  height: 150px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
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

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 90;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  cursor: pointer;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  z-index: 100;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow-x: hidden;
  overflow-y: auto;
`;
const BigCover = styled.img`
  width: 100%;
  height: 300px;
  border: 0 none;
  background-size: cover;
  background-position: center center;
  border: 0 none;
`;
const BigTitle = styled.h3`
  position: relative;
  top: -50px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 28px;
  font-weight: 500;
  padding: 0 20px;
  box-sizing: Border-box;
`;
const BigOverview = styled.p`
  padding: 20px;
  margin-top: -30px;
  word-break: keep-all;
  color: ${(props) => props.theme.white.lighter};
  b {
    font-weight: bold;
    font-size: 22px;
  }
  b:nth-of-type(2) {
    color: yellow;
    font-size: 18px;
  }
  span {
    font-weight: 600;
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

export default Slider;
