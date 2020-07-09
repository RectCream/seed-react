import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Container, Row, Col, ProgressBar
  , Nav, Carousel, Button, Navbar
} from 'react-bootstrap';
import './myGardenStyle.css';
import {useBreedInfo} from './context/useBreedInfo';
import {Spinner} from './components/notification';

function markdownExtractor(str) {
  const pages = str.split(/(?=#\s+)/);
  const content = [];
  pages.forEach((element) => {
    // the following regex expression explain:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    // https://stackoverflow.com/questions/12059284/get-text-between-two-rounded-brackets
    const slides = [];
    const regRes = element.match(/!\[.*\]\(.*\)/g);
    if (regRes) {
      regRes.forEach((slide) => {
        const alt = slide.match(/\[([^\]]+)\]/)[1];
        const url = slide.match(/\(([^)]+)\)/)[1];
        slides.push({'url': url, 'alt': alt});
      });
    }
    content.push({
      'title': element.split('\n')[0],
      'paragraphs': element.replace(/!\[.*\]\(.*\)/g, ''),
      'slides': slides,
    });
  });
  return content;
}

/* eslint-disable react/prop-types */
const MyGardenSide = ({onSelectAction}) => {
  return (
    <>
      <Nav className="col-md-12 d-md-block bg-light sidebar"
        toggle
        activeKey="tomato"
        onSelect={(selectedKey) => onSelectAction(selectedKey)}
      >
        <Nav.Item>
          <Nav.Link eventKey="tomato">西红柿</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="cucumber">黄瓜</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="greenonion">小葱</Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
};
/* eslint-enable react/prop-types */

const BreedLoading = () => {
  return (
    <>
      <Container fluid style={{maxWidth: 1250}}>
        <p>Loading...</p>
        <Spinner></Spinner>
      </Container>
    </>
  );
};

const BreedError = () => {
  return (
    <p>error getting content...</p>
  );
};

/* eslint-disable */
export default function MyGarden() {
  const [{ data, loading, hasError }, queryBreedInfo] = useBreedInfo({ vegeName: 'tomato' });
  const [activePage, setActivePage] = useState(1);
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 600
  });

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 600) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    window.addEventListener('resize', handleResize);
  })

  if (loading) {
    return <BreedLoading/>
  } else if (hasError) {
    return <BreedError/>
  } else {
    const content = markdownExtractor(data.markdown);
    const slides = [];

    const sideTabOnSelect = (selectedKey) => {
      console.log(`selected: ${selectedKey}`);
      queryBreedInfo({vegeName: selectedKey});
    };

    for (let number = 0; number < content.length; number++) {
      if (content[number]['slides'].length > 0) {
        const carouselItems = [];
        content[number]['slides'].forEach((element) => {
          carouselItems.push(
            <Carousel.Item>
              <img
                src={element.url}
                alt={element.alt}
              />
              <Carousel.Caption>
                <p>{element.alt}</p>
              </Carousel.Caption>
            </Carousel.Item>);
        });
        slides.push(
          <Carousel>
            {carouselItems}
          </Carousel>);
      } else {
        slides.push(<></>);
      }
    }

    const changePage = (direction) => {
      if (direction == 'next') {
        if (activePage == content.length) {
          setActivePage(content.length)
        } else {
          setActivePage(currentActivePage => currentActivePage + 1)
        }
      } else {
        if (activePage == 1) {
          setActivePage(1)
        } else {
          setActivePage(currentActivePage => currentActivePage - 1)
        }
      }
    }

    const simplePaging = () => {

      return (<>
        <Col>
          <Button size='sm' variant="outline-primary" onClick={() => changePage('back')}
                  style={{marginLeft:'1rem', marginRight:'1rem'}}>上一页</Button>
          <Button size='sm' variant="outline-primary" onClick={() => changePage('next')}
                  style={{marginLeft:'1rem', marginRight:'1rem'}}>下一页</Button>
        </Col>
       </>);
    };

    // "activePage - 1" to convert to index
    if (!isMobile) {
      return (
        <>
          <Container fluid>
            <Row>
              <Col sm={2} xs={2} md={2} lg={2}>
                <MyGardenSide onSelectAction={sideTabOnSelect} />
              </Col>
              <Col sm={10} xs={10} md={10} lg={10}>
                <Container fluid>
                  <ProgressBar now={activePage * 100 / content.length}
                    label={content[activePage - 1]['title']} />
                  <Row>
                    <Col sm={8} xs={8} md={8} lg={8}>
                      <ReactMarkdown
                        source={content[activePage - 1]['paragraphs']} />
                    </Col>
                    <Col sm={4} xs={4} md={4} lg={4}>
                      {slides[activePage - 1]}
                    </Col>
                  </Row>
                  <Row style={{marginTop: "2rem"}}>
                    {simplePaging()}
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </>
      );
    } else {
      return (
        <>
          <Container fluid>
            <Row>               
              <Navbar collapseOnSelect  expand="sm">
                <Navbar.Toggle />
                <Navbar.Collapse>
                  <MyGardenSide onSelectAction={sideTabOnSelect} />
                </Navbar.Collapse>
              </Navbar>
            </Row>
            <Row>
              <Col>
                <ProgressBar now={activePage * 100 / content.length}
                    label={content[activePage - 1]['title']} />              
              </Col>
            </Row>
            <Row>
              <Col style={{leftMargin: 1, rightMargin: 1}}>
                <ReactMarkdown
                  source={content[activePage - 1]['paragraphs']} />              
              </Col>
            </Row>
            <Row>
              <Col>
                {slides[activePage - 1]}
              </Col>
            </Row>
            <Row style={{marginTop: "2rem"}}>
              {simplePaging()}
            </Row>
          </Container>
        </>
      );
    }
  }
}
/* eslint-ensable */