import { useEffect, useState } from "react";
import ReactBridge from "./ReactBridge";
const bridge = new ReactBridge("http://localhost:3000");
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  Badge,
  Burger,
  Button,
  Card,
  Chip,
  createTheme,
  Group,
  Image,
  MantineProvider,
  ScrollArea,
  Progress,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { Center, Box } from "@mantine/core";
import { Grid, Skeleton, Container } from "@mantine/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { ActionIcon } from "@mantine/core";
import {
  IconFolderSearch,
  IconRestore,
  IconFileSearch,
} from "@tabler/icons-react";
const FileView = ({ filename }) => {
  return (
    <Card radius="xs" withBorder mb={4}>
      <Group justify="start">
        <Badge color="pink">Dosya</Badge>
        <Text fw={500}>{filename.replace(/^.*[\\\/]/, "")}</Text>
        <ActionIcon
          variant="filled"
          aria-label="Settings"
          size="xl"
          onClick={() => {
            bridge.execute("open-file", {
              filename,
            });
          }}
        >
          <IconFileSearch
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Group>
    </Card>
  );
};

const AiOrganize = () => {
  const [folders, setFolders] = useState({});
  const [finalStructure, setFinalStructure] = useState({});
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [progress, setProgress] = useState(0);
  const [aiWorking, setAiWorking] = useState(false);
  const handleMoveFiles = () => {
    // bu işlemler de statüye kaydedilsin.
    bridge
      .execute("move-files", { folders })
      .then((data) => {})
      .catch((error) => {
        console.error(error);
      });
  };
  const handleCategorize = () => {
    bridge
      .execute("categorize-files")
      .then((data) => {
        setFolders(data);
      })
      .catch((error) => {
        console.error(error);
      });
    bridge.on(
      "ai-progress",
      (data) => {
        let { current, total } = data;
        setProgress((current / total) * 100);
      },
      () => {
        setAiWorking(false);
      }
    );
    setAiWorking(true);
  };

  const getState = () => {
    bridge
      .execute("get-state", {})
      .then((data) => {
        let { targetPath, files, folders, currentStructure } = data;
        setFolders(currentStructure);
      })
      .catch((error) => {
        setFolders({});
      });
  };

  useEffect(() => {
    getState();
  }, []); // Empty dependency array to run effect only once

  const onDragEnd = (result) => {
    //TODO:her drag dropta state güncellensin
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceFolder = folders[source.droppableId];
    const destFolder = folders[destination.droppableId];

    const [movedFile] = sourceFolder.splice(source.index, 1);
    destFolder.splice(destination.index, 0, movedFile);

    const updatedFolders = {
      ...folders,
      [source.droppableId]: sourceFolder,
      [destination.droppableId]: destFolder,
    };

    setFolders(updatedFolders);
    bridge.execute("drag-drop-files", updatedFolders);

    setFinalStructure(updatedFolders);
    console.log(updatedFolders);
  };

  const handleFolderEdit = (folderName) => {
    setEditingFolder(folderName);
    setNewFolderName(folderName);
  };

  const handleFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const handleFolderNameSubmit = () => {
    const updatedFolders = {};
    Object.keys(folders).forEach((folderName) => {
      if (folderName === editingFolder) {
        updatedFolders[newFolderName] = folders[folderName];
      } else {
        updatedFolders[folderName] = folders[folderName];
      }
    });

    setFolders(updatedFolders);
    setFinalStructure(updatedFolders);
    setEditingFolder(null);
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger hiddenFrom="sm" size="sm" />
          AI Organize Uygulaması
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Grid gutter={2} mb={20}>
          <Grid.Col span="6">
            <Button
              fullWidth
              size="lg"
              radius="md"
              color="blue"
              onClick={handleCategorize}
            >
              AI ile Organize Et
            </Button>
          </Grid.Col>
          <Grid.Col span="6">
            <Button
              fullWidth
              size="lg"
              radius="md"
              color="indigo"
              onClick={handleMoveFiles}
            >
              Taşımayı Uygula
            </Button>
          </Grid.Col>
        </Grid>
        {aiWorking && <Progress size="xl" value={progress} animated />}
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid gutter={10}>
            {Object.keys(folders).map((folderName) => (
              <Grid.Col key={folderName} span="3">
                <Card withBorder shadow="sm" radius="md">
                  <Card.Section withBorder inheritPadding py="xs">
                    <Group justify="space-between">
                      {editingFolder === folderName ? (
                        <TextInput
                          value={newFolderName}
                          onChange={handleFolderNameChange}
                          onBlur={handleFolderNameSubmit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleFolderNameSubmit();
                            }
                          }}
                        />
                      ) : (
                        <Text
                          fw={500}
                          onClick={() => handleFolderEdit(folderName)}
                        >
                          {folderName}
                        </Text>
                      )}
                    </Group>
                  </Card.Section>
                  <Card.Section withBorder inheritPadding py="xs">
                    <Droppable droppableId={folderName}>
                      {(provided) => (
                        <ScrollArea
                          h={350}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {folders[folderName].map((file, index) => (
                            <Draggable
                              key={file}
                              draggableId={file}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <FileView filename={file} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ScrollArea>
                      )}
                    </Droppable>
                  </Card.Section>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </DragDropContext>
        <Card withBorder shadow="sm" radius="md" mt={20}>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Final Klasör Yapısı</Text>
            </Group>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <ScrollArea h={350}>
              <pre>{JSON.stringify(finalStructure, null, 2)}</pre>
            </ScrollArea>
          </Card.Section>
        </Card>
      </AppShell.Main>
    </AppShell>
  );
};

export default AiOrganize;
