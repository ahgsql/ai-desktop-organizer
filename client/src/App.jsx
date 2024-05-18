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
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { Center, Box } from "@mantine/core";
import { Grid, Skeleton, Container } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { useNavigate } from "react-router-dom";

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

const App = () => {
  const [content, setContent] = useState("");
  const [folder, setFolder] = useState("");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const openDialog = () => {
    bridge
      .execute("open-folder-dialog", {})
      .then((data) => {
        setFolder(data);
      })
      .catch((error) => {
        setFolder("data");
      });
  };
  const getState = () => {
    bridge
      .execute("get-state", {})
      .then((data) => {
        let { targetPath, files, folders } = data;
        console.log(folders);
        setFolder(targetPath);
        setFiles(files);
        setFolders(folders);
      })
      .catch((error) => {
        setFiles([]);
      });
  };
  const handleGetFilesAndFolder = () => {
    bridge
      .execute("get-files-and-folders", {
        folder,
        includeFolders: checked,
      })
      .then((data) => {
        console.log(data.folderNames);
        setFolders(data.folderNames);
        setFiles(data.parsedFiles);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getState();
  }, []); // Empty dependency array to run effect only once
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger hiddenFrom="sm" size="sm" />
          test
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py={10}>
          <Text align="center" size="xl" weight={700} mb={10}>
            Organize Edilecek Klasörü Seçin
          </Text>
          <Grid grow>
            <Grid.Col span={10}>
              <TextInput
                placeholder="Klasör yolunu girin"
                value={folder}
                onChange={(e) => setFolder(e.currentTarget.value)}
                size="lg"
                mb={10}
              />
            </Grid.Col>
            <Grid.Col span="auto">
              <Tooltip label="Gözat">
                <ActionIcon
                  variant="filled"
                  aria-label="Settings"
                  size="xl"
                  onClick={openDialog}
                >
                  <IconFolderSearch
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Tooltip>
            </Grid.Col>
            <Grid.Col span="auto">
              <Tooltip label="Baştan Başla">
                <ActionIcon
                  variant="filled"
                  aria-label="Settings"
                  size="xl"
                  color="grape"
                  onClick={() => {
                    bridge.execute("reset-state", {}).then(getState());
                  }}
                >
                  <IconRestore
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Tooltip>
            </Grid.Col>
          </Grid>
          <Grid gutter={2} mb={20}>
            <Grid.Col span="3">
              <Chip
                defaultChecked
                color="indigo"
                variant="light"
                size="xl"
                checked={checked}
                onChange={() => setChecked((v) => !v)}
              >
                Klasör İsimlerinide Dahil Et
              </Chip>
            </Grid.Col>
            <Grid.Col span="5">
              <Button
                fullWidth
                size="lg"
                radius="md"
                color="blue"
                onClick={handleGetFilesAndFolder}
              >
                Dosyaları Getir
              </Button>
            </Grid.Col>
            <Grid.Col span="4">
              <Button
                fullWidth
                size="lg"
                radius="md"
                color="blue"
                onClick={() => navigate("/ai-organize")}
              >
                AI İle Organize Et
              </Button>
            </Grid.Col>
          </Grid>
        </Container>
        <Grid gutter={2}>
          <Grid.Col span="6">
            <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>Dosyalar</Text>
                </Group>
              </Card.Section>
              <Card.Section withBorder inheritPadding py="xs">
                <ScrollArea h={350}>
                  {files.map((file, i) => {
                    return <FileView key={i} filename={file.file} />;
                  })}
                </ScrollArea>
              </Card.Section>
            </Card>
          </Grid.Col>
          <Grid.Col span="6">
            <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>Klasörler</Text>
                </Group>
              </Card.Section>
              <Card.Section withBorder inheritPadding py="xs">
                <ScrollArea h={350}>
                  {folders.map((file, i) => {
                    return <FileView key={i} filename={file} />;
                  })}
                </ScrollArea>
              </Card.Section>
            </Card>
          </Grid.Col>
        </Grid>
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
