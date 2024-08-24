import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";

import { toast, ToastContainer } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TopSpot = ({
  serverDetails,
  getServerDetails,
}: {
  serverDetails: any;
  getServerDetails: any;
}) => {
  const [startupCommand, setStartupCommand] = useState(
    serverDetails.container.startup_command
  );
  const [environmentVariables, setEnvironmentVariables] = useState({});
  const [image, setImage] = useState(serverDetails.container.image);
  const [skip_scripts, setSkipScripts] = useState(false);
  const [defaultStartupCommand, setDefaultStartupCommand] = useState("");
  const getDefaultStartupCommand = async () => {
    try {
      const eggId = serverDetails.egg;
      // get the nest
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo`,
        {
          eggId,
        },
        {
          withCredentials: true,
        }
      );
      // //console.log(response.data.data)
      const nest = response.data.data.parentNest[0];
      //console.log(nest);

      const mainResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo/${nest}/${eggId}`,
        {
          withCredentials: true,
        }
      );
      //console.log(mainResponse.data.data);
      setDefaultStartupCommand(mainResponse.data.data.startup);
      mainResponse.data.data.relationships.variables.data.forEach(
        (variable: any) => {
          setEnvironmentVariables((prev: any) => {
            return {
              ...prev,
              [variable.attributes.env_variable]:
                serverDetails.container.environment[
                  variable.attributes.env_variable
                ],
            };
          });
        }
      );
    } catch (error) {
      //console.log(error);
    }
  };

  const updateDetails = async () => {
    // //console.log(startupCommand)
    // //console.log(environmentVariables)
    // //console.log(image)
    // //console.log(skip_scripts)
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/servers/update/startup/${
          serverDetails.id
        }`,
        {
          startup: startupCommand,
          environment: environmentVariables,
          image: image,
          skip_scripts: skip_scripts,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Server details updated successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await getServerDetails();
    } catch (error) {
      //console.log(error);
      toast.error("Something went wrong", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    (async () => {
      await getDefaultStartupCommand();
    })();
  }, []);

  return (
    <div className="w-[80%] bg-[#0a1a2b] p-4 rounded-lg ml-1">
      <ToastContainer />
      <div className="bg-[var(--quinary-color)] px-3 py-2 rounded-lg ">
        Startup Command Modification
      </div>
      <div className="mt-2 text-gray-200 ml-2">Startup Command</div>
      <div className="mt-2  ml-3">
        <Input
          type="text"
          placeholder="No Startup Command..."
          value={startupCommand}
          className="dark:bg-[var(--quinary-color)] dark:text-gray-500"
          onChange={(e) => setStartupCommand(e.target.value)}
        />
      </div>
      <div>
        <p className="text-gray-500 ml-3 text-xs mt-1">
          Edit your server's startup command here. The following variables are
          available by default: SERVER_MEMORY, SERVER_IP, and SERVER_PORT.
        </p>
      </div>

      <div className="mt-4 text-gray-200 ml-2">Default Startup Command</div>
      <div className="mt-2 text-gray-500 ml-3 w-full">
        <input
          disabled
          type="text"
          placeholder="Loading..."
          value={defaultStartupCommand}
          className="dark:bg-[var(--quinary-color)] dark:text-gray-500 w-full text-sm p-2 rounded-lg cursor-not-allowed"
          onChange={(e) => setStartupCommand(e.target.value)}
        />
      </div>
      <div className="mt-4 flex w-full ">
        <div className="ml-auto">
          <Button
            className=" rounded-lg text-sm"
            color="info"
            onClick={async () => {
              await updateDetails();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

const EnvironmentSpot = ({
  serverDetails,
  getServerDetails,
}: {
  serverDetails: any;
  getServerDetails: any;
}) => {
  //   console.log(serverDetails);
  const [startupCommand, setStartupCommand] = useState(
    serverDetails.container.startup_command
  );
  const [environmentVariables, setEnvironmentVariables] = useState<any>({});
  const [image, setImage] = useState(serverDetails.container.image);
  const [skip_scripts, setSkipScripts] = useState(false);
  const [defaultStartupCommand, setDefaultStartupCommand] = useState("");
  const getDetails = async () => {
    try {
      const eggId = serverDetails.egg;
      // get the nest
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo`,
        {
          eggId,
        },
        {
          withCredentials: true,
        }
      );
      // //console.log(response.data.data)
      const nest = response.data.data.parentNest[0];
      //console.log(nest);

      const mainResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo/${nest}/${eggId}`,
        {
          withCredentials: true,
        }
      );
      console.log(mainResponse.data.data);
      setDefaultStartupCommand(mainResponse.data.data.startup);
      mainResponse.data.data.relationships.variables.data.forEach(
        (variable: any) => {
          setEnvironmentVariables((prev: any) => {
            return {
              ...prev,
              [variable.attributes.env_variable]:
                serverDetails.container.environment[
                  variable.attributes.env_variable
                ],
            };
          });
        }
      );
    } catch (error) {
      //console.log(error);
    }
  };

  const updateDetails = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/servers/update/startup/${
          serverDetails.id
        }`,
        {
          startup: startupCommand,
          environment: environmentVariables,
          image: image,
          skip_scripts: skip_scripts,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Server details updated successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await getServerDetails();
    } catch (error) {
      //console.log(error);
      toast.error("Something went wrong", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    (async () => {
      await getDetails();
    })();
  }, []);
  useEffect(() => {
    //console.log(environmentVariables)
    //console.log(serverDetails.container.environment)
  }, [environmentVariables]);
  if (!environmentVariables) return <Audio />;

  return (
    <div className="w-[100%] flex flex-wrap gap-3 p-4 mt-2">
      {Object.keys(environmentVariables).map((env: any) => {
        return (
          <div className="w-[40%] bg-[#0a1a2b] p-4 rounded-lg ">
            <div className="bg-[var(--quinary-color)] px-3 py-2 rounded-lg capitalize ">
              {`${
                env.split("_")[0].toLowerCase() +
                " " +
                env.split("_")[1]?.replace("JARFILE", "JAR").toLowerCase()
              }`}{" "}
              Modification
            </div>
            <div className="mt-2">
              <Input
                type="text"
                placeholder="No Startup Command..."
                value={environmentVariables[env]}
                className="dark:bg-[var(--quinary-color)] dark:text-gray-500"
                onChange={(e) =>
                  setEnvironmentVariables((prev: any) => {
                    return {
                      ...prev,
                      [env]: e.target.value,
                    };
                  })
                }
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await updateDetails();
                  }
                }}
              />
              <p className="text-gray-500 ml-1 text-xs mt-1">
                Hit enter to update the environment variable.
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const UpdateDockerImage = ({
  serverDetails,
  getServerDetails,
}: {
  serverDetails: any;
  getServerDetails: any;
}) => {
  const [startupCommand, setStartupCommand] = useState(
    serverDetails.container.startup_command
  );
  const [environmentVariables, setEnvironmentVariables] = useState<any>({});
  const [image, setImage] = useState(serverDetails.container.image);
  const [images, setImages] = useState([]);
  const [skip_scripts, setSkipScripts] = useState(false);
  const [defaultStartupCommand, setDefaultStartupCommand] = useState("");
  const getDetails = async () => {
    try {
      const eggId = serverDetails.egg;
      // get the nest
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo`,
        {
          eggId,
        },
        {
          withCredentials: true,
        }
      );
      // //console.log(response.data.data)
      const nest = response.data.data.parentNest[0];
      //console.log(nest);

      const mainResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo/${nest}/${eggId}`,
        {
          withCredentials: true,
        }
      );
      console.log(mainResponse.data.data.docker_images);
      setImages(mainResponse.data.data.docker_images);
      setDefaultStartupCommand(mainResponse.data.data.startup);
      mainResponse.data.data.relationships.variables.data.forEach(
        (variable: any) => {
          setEnvironmentVariables((prev: any) => {
            return {
              ...prev,
              [variable.attributes.env_variable]:
                serverDetails.container.environment[
                  variable.attributes.env_variable
                ],
            };
          });
        }
      );
    } catch (error) {
      //console.log(error);
    }
  };

  console.log(image);

  const updateDetails = async (value : any) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/servers/update/startup/${
          serverDetails.id
        }`,
        {
          startup: startupCommand,
          environment: environmentVariables,
          image: value || image,
          skip_scripts: skip_scripts,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Server details updated successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await getServerDetails();
    } catch (error) {
      //console.log(error);
      toast.error("Something went wrong", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  console.log(serverDetails);
  const onChange = async (value : any) => {
    console.log(value);
 
    await updateDetails(value);
    setImage(value);
  };
  useEffect(() => {
    (async () => {
      await getDetails();
    })();
  }, []);
  if (!images) return <Audio />;
  return (
    <div className="w-[80%] mt-4 bg-[#0a1a2b] p-4 rounded-lg ml-1">
    
      <div className="bg-[var(--quinary-color)] px-3 py-2 rounded-lg ">
        Docker Image Configuration
      </div>
      <div className="mt-2">
        <Select
            onValueChange={async(value) => await onChange(value)}
            defaultValue={
                image
            }
    >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={`Select ${image}`} />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(images).map((image: any) => {
              return <SelectItem value={images[image]}>{image}</SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const Startup = ({
  serverDetails,
  serverDBdata,
  getServerDetails,
}: {
  serverDetails: any;
  serverDBdata: any;
  getServerDetails: any;
}) => {
  //   //console.log(serverDetails);
  //   //console.log(serverDBdata);

  return (
    <div className="gap-4 mt-2 w-full">
      <TopSpot
        serverDetails={serverDetails}
        getServerDetails={getServerDetails}
      />
      
      <UpdateDockerImage
        serverDetails={serverDetails}
        getServerDetails={getServerDetails}
      />
      <EnvironmentSpot
        serverDetails={serverDetails}
        getServerDetails={getServerDetails}
      />
    </div>
  );
};

export default Startup;
