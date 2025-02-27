import React, { useState } from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import GitHubButton from 'react-github-btn';
import Loadable from 'react-loadable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons';

import Link from './Link';
import LoadingProvider from '../mdxComponents/loading';
import config from '../../../config.js';

const help = require('../images/help.svg');

const isSearchEnabled = config.header.search && config.header.search.enabled ? true : false;

let searchIndices = [];

if (isSearchEnabled && config.header.search.indexName) {
  searchIndices.push({
    name: `${config.header.search.indexName}`,
    title: `Results`,
    hitComp: `PageHit`,
  });
}

import Sidebar from '../sidebar';

const LoadableComponent = Loadable({
  loader: () => import('../search/index'),
  loading: LoadingProvider,
});

const StyledBgDiv = styled.div`
  height: 60px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #f8f8f8;
  position: relative;
  display: none;
  background: #001932;

  @media (max-width: 767px) {
    display: block;
  }
`;

const NavBarHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const HeaderIconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .paddingAround {
    padding-right: 10px;
  }
`;

const HideOnDesktop = styled.div`
  @media (min-width: 767px) {
    display: none;
  }
`;

const Header = () => {
  const logoImg = require('../images/logo.svg');

  const twitter = require('../images/twitter.svg');

  const [navCollapsed, setNavCollapsed] = useState(true);

  const topClass = navCollapsed ? 'topnav' : 'topnav responsive ';

  return (
    <StaticQuery
      query={graphql`
        query headerTitleQuery {
          site {
            siteMetadata {
              headerTitle
              githubUrl
              helpUrl
              tweetText
              logo {
                link
                image
                mobile
              }
              headerLinks {
                link
                text
              }
            }
          }
        }
      `}
      render={(data) => {
        const {
          site: {
            siteMetadata: { headerTitle, githubUrl, helpUrl, tweetText, logo, headerLinks },
          },
        } = data;

        const finalLogoLink = logo.link !== '' ? logo.link : 'https://incidentdatabase.ai/';

        return (
          <div>
            <nav className={'navBarDefault'}>
              <NavBarHeaderContainer>
                <div className={'navBarHeader'}>
                  <Link to={finalLogoLink} className={'navBarBrand'}>
                    <img
                      id="desktopLogo"
                      className={'hiddenMobile'}
                      style={{ width: 200 }}
                      src={logo.image !== '' ? logo.image : logoImg}
                      alt={'logo'}
                    />
                    <HideOnDesktop>
                      <img
                        style={{ width: 50 }}
                        src={logo.mobile !== '' ? logo.mobile : logoImg}
                        alt={'logo'}
                      />
                    </HideOnDesktop>
                  </Link>
                  <li className="divider hiddenMobile"></li>
                  <div
                    className={'headerTitle displayInline'}
                    dangerouslySetInnerHTML={{ __html: headerTitle }}
                  />
                </div>
                <HeaderIconsContainer>
                  <li className="divider hiddenMobile"></li>
                  {config.header.social && (
                    <a
                      className="paddingAround"
                      href={'https://twitter.com/IncidentsDB'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faTwitterSquare}
                        color={'white'}
                        className="pointer fa fa-twitter-square fa-lg"
                        title="Open Twitter"
                      />
                    </a>
                  )}
                  {githubUrl !== '' && (
                    <div className="githubBtn paddingAround hiddenMobile">
                      <GitHubButton
                        href={githubUrl}
                        data-show-count="true"
                        aria-label="Star on GitHub"
                      >
                        Star
                      </GitHubButton>
                    </div>
                  )}
                  <a
                    className="paddingAround hiddenMobile"
                    href={'/rss.xml'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faRssSquare}
                      color={'white'}
                      className="pointer fa fa-rss-square fa-lg"
                      title="Open RSS Feed"
                    />
                  </a>
                  <HideOnDesktop>
                    <FontAwesomeIcon
                      icon={faBars}
                      color={'white'}
                      className="pointer fa fa-BARS fa-lg"
                      style={{ cursor: 'pointer' }}
                      title="Open Menu"
                      onClick={() => setNavCollapsed(!navCollapsed)}
                    />
                  </HideOnDesktop>
                </HeaderIconsContainer>
              </NavBarHeaderContainer>
              {isSearchEnabled ? (
                <div className={'searchWrapper hiddenMobile navBarUL'}>
                  <LoadableComponent collapse={true} indices={searchIndices} />
                </div>
              ) : null}
              <div id="navbar" className={topClass}>
                <div className={'visibleMobile'}>
                  <Sidebar setNavCollapsed={setNavCollapsed} />
                  <hr />
                </div>
                <ul className={'navBarUL navBarNav navBarULRight'}>
                  {headerLinks.map((link, key) => {
                    if (link.link !== '' && link.text !== '') {
                      return (
                        <li key={key}>
                          <a
                            className="sidebarLink"
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            dangerouslySetInnerHTML={{ __html: link.text }}
                          />
                        </li>
                      );
                    }
                  })}
                  {helpUrl !== '' ? (
                    <li>
                      <a href={helpUrl}>
                        <img src={help} alt={'Help icon'} />
                      </a>
                    </li>
                  ) : null}

                  {tweetText !== '' ? (
                    <li>
                      <a
                        href={'https://twitter.com/intent/tweet?&text=' + tweetText}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img className={'shareIcon'} src={twitter} alt={'Twitter'} />
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </nav>
            {isSearchEnabled && (
              <StyledBgDiv>
                <div className={'searchWrapper'}>
                  <LoadableComponent collapse={true} indices={searchIndices} />
                </div>
              </StyledBgDiv>
            )}
          </div>
        );
      }}
    />
  );
};

export default Header;
