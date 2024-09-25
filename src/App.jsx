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

  if (filterSettings.filterProductsByIncludes) {
    preVisibleProducts = preVisibleProducts.filter(product =>
      product.name
        .toLowerCase()
        // eslint-disable-next-line
        .includes(filterSettings.filterProductsByIncludes.toLowerCase()),);
  }

  if (filterSettings.filterProductsByCategory.length > 0) {
    preVisibleProducts = preVisibleProducts.filter(product => {
      return filterSettings.filterProductsByCategory.includes(
        // eslint-disable-next-line
        product.category.title);
    });
  }

  return preVisibleProducts;
};

export const App = () => {
  const [filterInstructions, setFilterInstructions] = React.useState({
    filterProductsByOwner: '',
    filterProductsByCategory: [],
    filterProductsByIncludes: '',
  });

  const visibleProducts = getProductsFilteredAndSorted(
    preparedProducts,
    filterInstructions,
  );

  // console.log(filterInstructions.filterProductsByCategory);

  const handleSetFilterProductsByOwner = productOwnerName => {
    setFilterInstructions(prevFilterInstructions => {
      return {
        ...prevFilterInstructions,
        filterProductsByOwner: productOwnerName,
      };
    });
  };

  const handleSetFilterProductsByIncludes = partOfProductName => {
    setFilterInstructions(prevFilterInstructions => {
      return {
        ...prevFilterInstructions,
        filterProductsByIncludes: partOfProductName,
      };
    });
  };

  const handleSetFilterProductsByCategory = categoryName => {
    setFilterInstructions(prevFilterInstructions => {
      if (categoryName === 'all') {
        return {
          ...prevFilterInstructions,
          filterProductsByCategory: [],
        };
      }

      const isCategoryInState =
        prevFilterInstructions.filterProductsByCategory.findIndex(
          category => category === categoryName,
        );

      if (isCategoryInState >= 0) {
        const tempCategoriesFilter = [
          ...prevFilterInstructions.filterProductsByCategory,
        ];

        tempCategoriesFilter.splice(isCategoryInState, 1);

        return {
          ...prevFilterInstructions,
          filterProductsByCategory: [...tempCategoriesFilter],
        };
      }

      return {
        ...prevFilterInstructions,
        filterProductsByCategory: [
          ...prevFilterInstructions.filterProductsByCategory,
          categoryName,
        ],
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
                  key={user.id}
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
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={filterInstructions.filterProductsByIncludes}
                  onChange={event =>
                    handleSetFilterProductsByIncludes(
                      event.target.value.trimStart(),
                    )
                  }
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {filterInstructions.filterProductsByIncludes && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => handleSetFilterProductsByIncludes('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                onClick={() => {
                  handleSetFilterProductsByCategory('all');
                }}
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined':
                    filterInstructions.filterProductsByCategory.length > 0,
                })}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info':
                      filterInstructions.filterProductsByCategory.includes(
                        category.title,
                      ),
                  })}
                  href="#/"
                  onClick={() => {
                    handleSetFilterProductsByCategory(category.title);
                  }}
                >
                  {category.title}
                </a>
              ))}

            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  handleSetFilterProductsByOwner('');
                  handleSetFilterProductsByIncludes('');
                  handleSetFilterProductsByCategory([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length ? (
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
                  return (
                    <tr data-cy="Product" key={product.id}>
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
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
