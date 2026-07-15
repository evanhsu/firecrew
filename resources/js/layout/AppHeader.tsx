import {
    Anchor,
    Box,
    Burger,
    Drawer,
    Group,
    Menu,
    Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getNavConfig } from './navTypes';

type NavLink = {
    key: string;
    label: string;
    href: string;
};

function getNavLinks(): NavLink[] {
    const nav = getNavConfig();
    const { routes, type, crewId } = nav;

    const links: NavLink[] = [
        { key: 'map', label: 'Map', href: routes.map },
        { key: 'summary', label: 'Summary', href: routes.summary },
    ];

    if (type === 'user' && crewId) {
        links.push(
            { key: 'status', label: 'Status', href: routes.newStatus ?? '#' },
            { key: 'identity', label: 'Identity', href: routes.editCrew ?? '#' },
            { key: 'accounts', label: 'Accounts', href: routes.crewAccounts ?? '#' }
        );
    }

    if (type === 'admin') {
        links.push(
            { key: 'crews', label: 'Crews', href: routes.crewsIndex },
            { key: 'aircraft', label: 'Aircraft', href: routes.aircraftIndex },
            { key: 'accounts', label: 'Accounts', href: routes.usersIndex }
        );
    }

    return links;
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
    const nav = getNavConfig();
    const active = (nav.active ?? '').toLowerCase();

    return (
        <>
            {getNavLinks().map((link) => (
                <Anchor
                    key={link.key}
                    href={link.href}
                    fw={active === link.key ? 700 : 500}
                    c={active === link.key ? 'blue' : undefined}
                    onClick={onNavigate}
                >
                    {link.label}
                </Anchor>
            ))}
        </>
    );
}

function UserMenu() {
    const nav = getNavConfig();
    const { routes, userName } = nav;

    if (!userName) {
        const active = (nav.active ?? '').toLowerCase();
        return (
            <Anchor
                href={routes.login}
                fw={active === 'login' ? 700 : 500}
                c={active === 'login' ? 'blue' : undefined}
            >
                Login
            </Anchor>
        );
    }

    return (
        <>
            <form
                id="logout-form"
                action={routes.logout}
                method="POST"
                style={{ display: 'none' }}
            >
                <input
                    type="hidden"
                    name="_token"
                    value={window.Laravel.csrfToken}
                />
            </form>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <Anchor component="button" type="button" fw={500}>
                        {userName}
                    </Anchor>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item component="a" href={routes.editUserMe}>
                        My Account
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => {
                            document.getElementById('logout-form')?.submit();
                        }}
                    >
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
}

export const APP_HEADER_HEIGHT = 56;

export function AppHeader() {
    const [opened, { toggle, close }] = useDisclosure(false);

    return (
        <>
            <Box
                component="header"
                h={APP_HEADER_HEIGHT}
                px="md"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 200,
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    backgroundColor: 'var(--mantine-color-body)',
                }}
            >
                <Group h="100%" justify="space-between" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                            aria-label="Toggle navigation"
                        />
                        <Anchor href={getNavConfig().routes.home} fw={700} size="lg">
                            FireCrew
                        </Anchor>
                    </Group>

                    <Group gap="lg" wrap="nowrap">
                        <Group gap="lg" visibleFrom="sm">
                            <NavLinks />
                        </Group>
                        <UserMenu />
                    </Group>
                </Group>
            </Box>

            <Drawer
                opened={opened}
                onClose={close}
                position="left"
                size="xs"
                title="Navigation"
                hiddenFrom="sm"
            >
                <Stack gap="md">
                    <NavLinks onNavigate={close} />
                </Stack>
            </Drawer>
        </>
    );
}
