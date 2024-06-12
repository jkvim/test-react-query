/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  Link,
  useParams,
  BrowserRouter,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const NAME = "foo";

const useKeyMatch = (name: string, home?: string) => {
  return useQuery(
    ["test", name, home],
    () => {
      console.log("fetch", name, home);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ name, home });
        }, 1000);
      });
    },
    { keepPreviousData: true }
  );
};

const list = ["1", "2", "3"];

const ExampleWithRouter = ({ item }) => {
  const { dealId } = useParams();
  const [home, setHome] = useState(undefined);
  const { data, isLoading } = useKeyMatch(NAME, dealId);
  useEffect(() => {
    return () => {
      console.log("unmount");
    };
  }, []);
  console.log("isLoading", isLoading);

  return (
    <div>
      Example With Router
      <p>name: {data?.name}</p>
      <p>home: {data?.home}</p>
      <p>loading: {isLoading ? "true" : "false"}</p>
      <input
        value={home}
        onChange={(e) => {
          setHome(e.target.value);
        }}
      />
    </div>
  );
};

const ExampleWithoutRouter = () => {
  const [home, setHome] = useState(undefined);
  const [item, setItem] = useState();
  const { data, isLoading } = useKeyMatch('bar', item);
  useEffect(() => {
    return () => {
      console.log("unmount");
    };
  }, []);
  console.log("isLoading", isLoading);

  return (
    <div>
      <br />
      Example Without Router
      <p>name: {data?.name}</p>
      <p>home: {data?.home}</p>
      <p>loading: {isLoading ? "true" : "false"}</p>
      <input
        value={home}
        onChange={(e) => {
          setHome(e.target.value);
        }}
      />
      {list.map((item) => (
        <div key={item} onClick={() => setItem(item)}>{item}</div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Switch>
          <Route path="/:dealId">
            <ExampleWithRouter />
          </Route>
          <Route path="/" exact>
            {list.map((item) => (
              <div key={item}>
                <Link to={`/${item}`}>{item}</Link>
              </div>
            ))}
            <ExampleWithoutRouter />
          </Route>
        </Switch>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
