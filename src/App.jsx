/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
// import products from './api/products';

const preparedProducts = productsFromServer.map(product => {
  // const category = null; // find by product.categoryId
  // const user = null; // find by category.ownerId
  const productCategory = categoriesFromServer.find(
    category => product.categoryId === category.id,
  );

  return {
    ...product,
    category: productCategory,
    user: usersFromServer.find(user => user.id === productCategory.ownerId),
  };
});

const getProductsFilteredAndSorted = (prePreparedProducts, filterSettings) => {
  let preVisibleProducts = [...prePreparedProducts];

  if (filterSettings.filterProductsByOwner) {
    preVisibleProducts = preVisibleProducts.filter(
      product => product.user.name === filterSettings.filterProductsByOwner,
    );
  }

  return preVisibleProducts;
};

export const App = () => {
  console.log(preparedProducts[0]);
  const [filterInstructions, setFilterInstructions] = React.useState({
    filterProductsByOwner: '',
    filterProductsByCategory: '',
  });

  const visibleProducts = getProductsFilteredAndSorted(
    preparedProducts,
    filterInstructions,
  );

  const handleSetFilterProductsByOwner = productOwnerName => {
    setFilterInstructions(prevFilterInstructions => {
      return {
        ...prevFilterInstructions,
        filterProductsByOwner: productOwnerName,
      };
    });
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => handleSetFilterProductsByOwner('')}
                data-cy="FilterAllUsers"
                className={cn({
                  'is-active': !filterInstructions.filterProductsByOwner,
                })}
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={cn({
                    'is-active':
                      filterInstructions.filterProductsByOwner === user.name,
                  })}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => handleSetFilterProductsByOwner(user.name)}
                >
                  {user.name}
                </a>
              ))}

              {/* <a data-cy="FilterUser" href="#/"> */}
              {/*  User 1 */}
              {/* </a> */}

              {/* <a data-cy="FilterUser" href="#/" className="is-active"> */}
              {/*  User 2 */}
              {/* </a> */}

              {/* <a data-cy="FilterUser" href="#/"> */}
              {/*  User 3 */}
              {/* </a> */}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value="qwe"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map(product => {
                // console.log(product);
                return (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.ownerId} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                );
              })}

              {/* <tr data-cy="Product"> */}
              {/*  <td className="has-text-weight-bold" data-cy="ProductId"> */}
              {/*    1 */}
              {/*  </td> */}

              {/*  <td data-cy="ProductName">Milk</td> */}
              {/*  <td data-cy="ProductCategory">🍺 - Drinks</td> */}

              {/*  <td data-cy="ProductUser" className="has-text-link"> */}
              {/*    Max */}
              {/*  </td> */}
              {/* </tr> */}

              {/* <tr data-cy="Product"> */}
              {/*  <td className="has-text-weight-bold" data-cy="ProductId"> */}
              {/*    2 */}
              {/*  </td> */}

              {/*  <td data-cy="ProductName">Bread</td> */}
              {/*  <td data-cy="ProductCategory">🍞 - Grocery</td> */}

              {/*  <td data-cy="ProductUser" className="has-text-danger"> */}
              {/*    Anna */}
              {/*  </td> */}
              {/* </tr> */}

              {/* <tr data-cy="Product"> */}
              {/*  <td className="has-text-weight-bold" data-cy="ProductId"> */}
              {/*    3 */}
              {/*  </td> */}

              {/*  <td data-cy="ProductName">iPhone</td> */}
              {/*  <td data-cy="ProductCategory">💻 - Electronics</td> */}

              {/*  <td data-cy="ProductUser" className="has-text-link"> */}
              {/*    Roma */}
              {/*  </td> */}
              {/* </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
