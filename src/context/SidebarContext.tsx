import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextProps {
  isOpen: boolean;
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
  menuData: any;
  loading: boolean;
  toggleSidebar: () => void;
  getJsonFile: (menu: string) => string;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("1Depth Menu");
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const getJsonFile = (menu: string) => {
    const dbMap: { [key: string]: string } = {
      "1Depth": "/db2.json",
    };
    return dbMap[menu] || "/db2.json";
  };

  useEffect(() => {
    setLoading(true);

    fetch(`${getJsonFile(selectedMenu)}?t=${new Date().getTime()}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        if (!text) {
          throw new Error("Empty JSON response");
        }
        return JSON.parse(text);
      })
      .then((data) => {
        setMenuData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error when fetching data:", err);
        setLoading(false);
      });
  }, [isOpen, selectedMenu]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        selectedMenu,
        setSelectedMenu,
        menuData,
        loading,
        getJsonFile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isOpen: false,
      selectedMenu: "",
      setSelectedMenu: () => {},
      menuData: null,
      loading: false,
      toggleSidebar: () => {},
      getJsonFile: () => "/db.json",
    };
  }
  return context;
};
