import React, { useEffect } from "react";
import styled from "styled-components";

const TestPage = () => {
  const images = [
    "https://placehold.co/600x400",
    "https://picsum.photos/600/500",
    "https://loremflickr.com/600/800",
    "https://placehold.co/600x400",
    "https://picsum.photos/600/400",
    "https://loremflickr.com/600/400",
    "https://placehold.co/600x400",
    "https://picsum.photos/600/400",
    "https://loremflickr.com/600/400",
  ];
  //"https://s3.ap-northeast-2.amazonaws.com/science-match-bucket/concept/blank/image/f1cbaee7-063f-440d-ba77-741e33e5cd99.jpg",

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
  };
  const tempName = async (url) => {
    try {
      const img = await loadImage(url);
      let tempWidth = img.naturalWidth;
      let tempHeight = img.naturalHeight;
      console.log(`${tempWidth}px : ${tempHeight}px`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    tempName(images[0]);
  }, []);
  const MyComponent = ({ images, lineUpFourDiv }) => (
    <Container>
      {Array.from({ length: 4 }).map((_, idx) => (
        <DivWrapper key={idx} lineUpFourDiv={lineUpFourDiv}>
          {images.slice(idx * 2, idx * 2 + 2).map((src, imgIdx) => (
            <React.Fragment>
              <Img key={imgIdx} src={src} lineUpFourDiv={lineUpFourDiv} />
            </React.Fragment>
          ))}
        </DivWrapper>
      ))}
    </Container>
  );
  return (
    <div>
      <MyComponent images={images} lineUpFourDiv={false} />
    </div>
  );
};

export default TestPage;
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 20rem);
  grid-template-rows: repeat(2, 30rem);
  gap: 1rem; /* div 간의 간격 */
`;

const DivWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
`;

const Img = styled.img`
  width: 18rem;
  height: auto;
  margin-bottom: 1rem;
`;
