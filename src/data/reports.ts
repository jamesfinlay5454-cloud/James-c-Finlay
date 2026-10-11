export interface DisclosedReport {
  id: string;
  reportNumber: number;
  upvotes: number;
  programHandle: string;
  programName: string;
  bountyAmount?: number;
  state: 'Resolved' | 'Informative' | 'Not-applicable' | 'Duplicate';
  title: string;
  reporter: string;
  disclosedDate: string;
  disclosedAgo: string;
  weaknessCwe: string;
  cvssScore?: number;
  cvssVector?: string;
  summary: string;
  tags: string[];
}

export const DISCLOSED_REPORTS: DisclosedReport[] = [
  {
    id: 'rep-r3-artifactory',
    reportNumber: 49,
    upvotes: 49,
    programHandle: 'r3',
    programName: 'R3',
    state: 'Resolved',
    title: "Full Admin Takeover of R3 Limited's JFrog Artifactory - 292 Users, Corda Enterprise & CBDC Supply Chain Compromised",
    reporter: 'qw3rjo',
    disclosedDate: '2026-10-08',
    disclosedAgo: '2 days ago',
    weaknessCwe: 'Improper Authentication - Generic',
    cvssScore: 9.8,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    summary: `A critical authentication bypass vulnerability was identified in an enterprise artifact repository system. The vulnerability, with a CVSS score of 9.8, resulted from a default empty join key that allowed unauthenticated attackers to forge authentication tokens and gain full administrative access.

Through exploitation of this flaw, the following was confirmed:
• Full administrative access was obtained to the repository instance
• Approximately 292 user accounts were exposed
• Access was gained to 269 repositories, including 81 blockchain-related repositories and 4 digital currency repositories
• 262 access tokens were extracted, including 30 with administrative privileges
• Repository creation and deletion capabilities were demonstrated
• User account creation and deletion were performed
• Configuration decryption revealed plaintext credentials
• Cryptographic signing keys were extracted from the system

All test modifications were removed after confirmation of access. The vulnerability affected a system running version 7.133.16 with an enterprise license valid through November 2026.`,
    tags: ['Critical', 'Supply Chain', 'Token Forgery', 'JFrog']
  },
  {
    id: 'rep-curl-cookie-truncation',
    reportNumber: 7,
    upvotes: 7,
    programHandle: 'curl',
    programName: 'curl',
    state: 'Informative',
    title: 'Cookie attribute truncation in curl drops Secure/HttpOnly protections',
    reporter: 'hasanfleyah',
    disclosedDate: '2026-10-08',
    disclosedAgo: '2 days ago',
    weaknessCwe: 'Information Exposure Through Sent Data',
    cvssScore: 5.3,
    summary: 'Cookie attribute parsing truncation in curl dropped Secure and HttpOnly flags under specific malformed header buffers, leading to potential leak over plain HTTP connections.',
    tags: ['Cookies', 'Network', 'CWE-200']
  },
  {
    id: 'rep-curl-hsts-ignored',
    reportNumber: 4,
    upvotes: 4,
    programHandle: 'curl',
    programName: 'curl',
    state: 'Informative',
    title: 'curl tool: --hsts is ignored for a schemeless URL starting with a slash under --proto-default http',
    reporter: 'samueloph',
    disclosedDate: '2026-10-08',
    disclosedAgo: '2 days ago',
    weaknessCwe: 'Cleartext Transmission of Sensitive Information',
    cvssScore: 4.8,
    summary: 'When parsing schemeless URLs starting with a slash under --proto-default http, HSTS database checks were inadvertently bypassed, sending traffic unencrypted.',
    tags: ['HSTS', 'CLI', 'Cleartext']
  },
  {
    id: 'rep-h1-code-datadog',
    reportNumber: 26,
    upvotes: 26,
    programHandle: 'security',
    programName: 'HackerOne',
    bountyAmount: 200,
    state: 'Resolved',
    title: 'HackerOne Code: a live password reset token reaches Datadog RUM, and the same session records the account it unlocks',
    reporter: 'sujitjaunjal',
    disclosedDate: '2026-10-08',
    disclosedAgo: '2 days ago',
    weaknessCwe: 'Insufficiently Protected Credentials',
    cvssScore: 7.5,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N',
    summary: `A password reset token was transmitted to a real user monitoring service before the reset form was submitted. The token was passed as a query string parameter in the URL and recorded by the monitoring SDK without any redaction. The same monitoring session also captured the account identifier after the user authenticated.

The monitoring service was configured with sampling at 100 percent and no URL sanitization callback, resulting in every reset token being recorded. The token was a live, single-use credential that could be used to reset any account without further authentication. A previously reported similar issue affecting a different telemetry service had been patched with path-specific redaction, but this left the same vulnerability open through an alternate monitoring sink that was not covered by that remediation.`,
    tags: ['Telemetry Leak', 'Password Reset', 'Datadog', 'Account Takeover']
  },
  {
    id: 'rep-mariadb-handlersocket',
    reportNumber: 16,
    upvotes: 16,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'MariaDB HandlerSocket Improper Request Field-Count Validation Causes Server Crash',
    reporter: 'xlabai',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Uncontrolled Resource Consumption',
    cvssScore: 7.5,
    summary: `A vulnerability was discovered in MariaDB Server's optional HandlerSocket plugin that allowed improper validation of request field-count parameters. When processing exec requests, the plugin allocated stack memory based on a client-supplied field count before validating whether the count was reasonable. An attacker could send requests with abnormally large field counts to cause the MariaDB process to crash, resulting in database service denial of service. The vulnerability affected deployments with HandlerSocket enabled, and could be exploited by unauthenticated attackers if no authentication secret was configured.`,
    tags: ['DoS', 'Memory Stack', 'HandlerSocket']
  },
  {
    id: 'rep-mariadb-sformat-oom',
    reportNumber: 10,
    upvotes: 10,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'MariaDB Low-Privilege User Can Exhaust Memory Through a Formatting Function and Crash the Service',
    reporter: 'xlabai',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Uncontrolled Resource Consumption',
    cvssScore: 6.5,
    summary: `A low-privilege database user was able to exhaust memory on a MariaDB server through the SFORMAT() function by specifying an extremely large width parameter. The function attempted to allocate nearly 2 GB of memory before generating the return value. Multiple concurrent requests caused the database process to be terminated by the system's out-of-memory mechanism, resulting in service unavailability. The vulnerability required only basic database login privileges and the ability to execute standard SELECT queries. No administrative access, table privileges, or user interaction was necessary to exploit this denial-of-service condition.`,
    tags: ['DoS', 'OOM', 'SFORMAT', 'Memory Exhaustion']
  },
  {
    id: 'rep-mariadb-drop-package',
    reportNumber: 10,
    upvotes: 10,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'DROP PACKAGE leaves PACKAGE BODY grant in mysql.procs_priv causing privilege escalation',
    reporter: 'heyoimjeb',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Improper Access Control - Generic',
    cvssScore: 8.1,
    summary: `A privilege escalation vulnerability was discovered in package management functionality. When a package was dropped, the associated grant in the privilege table for the package body was not removed, while the package object itself was deleted from the system catalog. If a new package with the same name was subsequently created, the orphaned grant allowed previous users to execute the new package without explicit authorization, running with the new definer's privileges. The vulnerability also propagated through role-based access control to all role members.`,
    tags: ['Privilege Escalation', 'RBAC', 'Orphaned Grant']
  },
  {
    id: 'rep-mariadb-integer-underflow',
    reportNumber: 8,
    upvotes: 8,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'Pre-authentication size_t integer underflow → out-of-bounds read / server crash in MariaDB caching_sha2_password via an RSA-OAEP',
    reporter: 'vnth4nhnt',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Integer Underflow',
    cvssScore: 7.5,
    summary: `A pre-authentication integer underflow vulnerability was discovered in the caching_sha2_password authentication plugin. When a client sent an RSA-OAEP encrypted empty message over plaintext TCP, the decrypted length was not validated before being used in a subtraction operation. This caused a size_t integer underflow that resulted in an out-of-bounds read in the SHA-256 hashing routine. The vulnerability allowed an unauthenticated attacker to crash the database server without requiring valid credentials.`,
    tags: ['Pre-auth', 'Integer Underflow', 'Crypto', 'OOB Read']
  },
  {
    id: 'rep-mariadb-file-udf',
    reportNumber: 7,
    upvotes: 7,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'Missing FILE-privilege enforcement in CONNECT file UDFs allows server-side file read and write',
    reporter: 'duongtt',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Improper Access Control - Generic',
    cvssScore: 8.8,
    summary: `A privilege enforcement vulnerability was discovered in file user-defined functions (UDFs) of a database engine. The file UDFs failed to enforce FILE privilege requirements and secure file path restrictions that were already implemented in the file-backed table handler. This allowed users with only SELECT privileges to read arbitrary files accessible to the database process and write files outside the configured secure directory.`,
    tags: ['Arbitrary File Read', 'UDF', 'Privilege Escalation']
  },
  {
    id: 'rep-mariadb-directory-abuse',
    reportNumber: 4,
    upvotes: 4,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'DATA / INDEX DIRECTORY Abuse',
    reporter: 'vortfu',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Path Traversal',
    cvssScore: 7.8,
    summary: `A vulnerability was identified in the DATA DIRECTORY and INDEX DIRECTORY functionality of a database system. Users with ordinary schema-level privileges were able to write arbitrary data to attacker-chosen locations by exploiting path traversal issues in how external table directories were processed. Checks failed when target paths contained non-existent segments, allowing files with arbitrary extensions to be written.`,
    tags: ['Path Traversal', 'Arbitrary File Write', 'Storage Engine']
  },
  {
    id: 'rep-mariadb-unescaped-sql',
    reportNumber: 3,
    upvotes: 3,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: '`SHOW [CREATE|GRANTS] ...` / `mariadb-dump` Unescaped SQL Generation',
    reporter: 'vortfu',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'SQL Injection',
    cvssScore: 7.2,
    summary: `A vulnerability was discovered where multiple SHOW commands and mariadb-dump generated SQL output with unescaped values derived from stored metadata. When a privileged user exported and reimported a database containing malicious metadata, the injected SQL executed with the privileges of the importing user.`,
    tags: ['SQL Injection', 'Second Order', 'mariadb-dump']
  },
  {
    id: 'rep-mariadb-priv-roles',
    reportNumber: 4,
    upvotes: 4,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'Privilege escalation via user controlled usernames / roles and views',
    reporter: 'vortfu',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Improper Access Control - Generic',
    cvssScore: 7.8,
    summary: `Newline characters embedded in usernames or roles were not properly sanitized when saved as raw option strings in view and stored procedure definers, allowing users to inject arbitrary definer configurations and execute SQL queries under the context of administrative users.`,
    tags: ['Definer Injection', 'Privilege Escalation', 'Views']
  },
  {
    id: 'rep-mariadb-mysql50-collision',
    reportNumber: 1,
    upvotes: 1,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: '#mysql50# legacy alias / internal table collisions',
    reporter: 'vortfu',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Internal Collision / Privilege Escalation',
    cvssScore: 8.5,
    summary: `Improper encoding of table names prefixed with #mysql50# allowed attackers to create tables that collided with internal reserved filenames used by the database system and storage engines, enabling unauthorized access to hidden tables and circumventing access control lists.`,
    tags: ['Internal Collision', 'RCE Vector', 'Partition Bypass']
  },
  {
    id: 'rep-mariadb-mysql50-stale',
    reportNumber: 1,
    upvotes: 1,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: '#mysql50# legacy alias / stale table cache identity mismatch',
    reporter: 'vortfu',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Stale Cache / RCE',
    cvssScore: 8.8,
    summary: `By opening a table through one spelling and replacing it through an alternative alias, the cache was poisoned with stale metadata. This stale metadata was then used against new attacker-controlled file data, enabling out-of-bounds memory reads, arbitrary memory reads/writes, and remote code execution.`,
    tags: ['Memory Corruption', 'RCE', 'Cache Poisoning']
  },
  {
    id: 'rep-mariadb-uaf-rce',
    reportNumber: 4,
    upvotes: 4,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'Low-privilege RCE in MariaDB: SYS_REFCURSOR cursor-array use-after-free chained with an ST_Area heap over-read',
    reporter: 'rdjgr',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Use After Free',
    cvssScore: 9.0,
    summary: `A critical remote code execution vulnerability was discovered in MariaDB Server 13.0.2 chaining two memory-safety bugs to allow an authenticated low-privilege user to execute arbitrary operating system commands without requiring FILE or SUPER privileges.

The chain combined a use-after-free in the SYS_REFCURSOR cursor array with an out-of-bounds heap read in the ST_Area geospatial calculation to leak ASLR/PIE base addresses, control a virtual method call table, and achieve arbitrary code execution. Demonstrated end-to-end against the Docker production image.`,
    tags: ['Critical', 'RCE', 'Use-After-Free', 'ASLR Bypass', 'Chain']
  },
  {
    id: 'rep-mariadb-cursor-uaf',
    reportNumber: 5,
    upvotes: 5,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'Heap Use-After-Free in Materialized_cursor::open via SYS_REFCURSOR Array Reallocation',
    reporter: 'akkoul',
    disclosedDate: '2026-10-07',
    disclosedAgo: '3 days ago',
    weaknessCwe: 'Use After Free',
    cvssScore: 8.4,
    summary: `A heap-use-after-free vulnerability was identified in the cursor opening function where array reallocation during nested cursor operations caused dangling pointer references. When a cursor's SELECT statement opened additional cursors, the underlying memory buffer was reallocated, invalidating previously stored pointer addresses and permitting arbitrary vtable calls.`,
    tags: ['Heap UAF', 'VTable', 'Memory Safety']
  },
  {
    id: 'rep-rails-number-helpers-dos',
    reportNumber: 16,
    upvotes: 16,
    programHandle: 'rails',
    programName: 'Ruby on Rails',
    state: 'Resolved',
    title: 'Possible DoS in NumberHelpers',
    reporter: 'manun',
    disclosedDate: '2026-10-06',
    disclosedAgo: '4 days ago',
    weaknessCwe: 'Uncontrolled Resource Consumption',
    cvssScore: 6.5,
    summary: `A denial of service vulnerability was discovered in Active Support's number helpers. Strings in scientific notation were accepted and processed recursively, which could cause excessive memory consumption or CPU exhaustion. Now patched to treat strings with scientific notation characters as non-numeric input.`,
    tags: ['ActiveSupport', 'DoS', 'Ruby on Rails', 'CPU Exhaustion']
  },
  {
    id: 'rep-curl-secure-cookie-leak',
    reportNumber: 6,
    upvotes: 6,
    programHandle: 'curl',
    programName: 'curl',
    state: 'Informative',
    title: 'libcurl: Secure=1 cookie flag bypasses the 8.22.0 fix and leaks over HTTP',
    reporter: 'nonetype_',
    disclosedDate: '2026-10-06',
    disclosedAgo: '4 days ago',
    weaknessCwe: 'Information Exposure Through Sent Data',
    cvssScore: 5.3,
    summary: 'libcurl failed to properly match the Secure=1 cookie attribute after an edge-case redirect sequence, causing sensitive session cookies to be transmitted over plain HTTP.',
    tags: ['libcurl', 'Cookie Flag', 'Cleartext Leak']
  },
  {
    id: 'rep-curl-uaf-referer',
    reportNumber: 24,
    upvotes: 24,
    programHandle: 'curl',
    programName: 'curl',
    state: 'Not-applicable',
    title: 'Use-after-free read of the freed referer buffer in curl_easy_setopt(CURLOPT_REFERER) — stale heap bytes transmitted in an outbound Referer: header',
    reporter: 'nextarjunaxfer',
    disclosedDate: '2026-10-05',
    disclosedAgo: '5 days ago',
    weaknessCwe: 'Information Disclosure',
    cvssScore: 5.0,
    summary: 'Stale heap buffer dereference when repeatedly modifying CURLOPT_REFERER in multithreaded requests without locks, leading to outbound transmission of residual memory in Referer headers.',
    tags: ['UAF', 'Referer Header', 'Memory Leak']
  },
  {
    id: 'rep-essity-html-injection',
    reportNumber: 35,
    upvotes: 35,
    programHandle: 'essity',
    programName: 'Essity',
    state: 'Resolved',
    title: 'HTML Injection in Contact Form Email Enables Phishing via Legitimate Infrastructure',
    reporter: 'tenzai',
    disclosedDate: '2026-10-05',
    disclosedAgo: '5 days ago',
    weaknessCwe: 'Improper Output Neutralization for Logs',
    cvssScore: 6.5,
    summary: `An HTML injection vulnerability was discovered in a contact form email endpoint. The firstName field was rendered as unescaped HTML in transactional confirmation emails sent via SendGrid. Anchor tags with inline styles were not sanitized and persisted in email clients, allowing styled links to be injected into legitimate branded emails without CAPTCHA or rate limiting.`,
    tags: ['HTML Injection', 'SendGrid', 'Phishing Vector']
  },
  {
    id: 'rep-curl-rustls-oob',
    reportNumber: 6,
    upvotes: 6,
    programHandle: 'curl',
    programName: 'curl',
    state: 'Not-applicable',
    title: 'Rustls backend discloses out-of-bounds heap data during legal IMAP upload cancellation',
    reporter: 'stze',
    disclosedDate: '2026-10-05',
    disclosedAgo: '5 days ago',
    weaknessCwe: 'Out-of-bounds Read',
    cvssScore: 5.2,
    summary: 'Premature socket closure during IMAP append over TLS caused the rustls curl backend to read beyond buffer boundaries during cleanup routines.',
    tags: ['Rustls', 'IMAP', 'OOB Read']
  },
  {
    id: 'rep-curl-imap-literal',
    reportNumber: 8,
    upvotes: 8,
    programHandle: 'curl',
    programName: 'curl',
    state: 'Informative',
    title: 'IMAP literal size truncation on 32-bit platforms corrupts downloads and desynchronizes the response parser',
    reporter: 'cyberfathy',
    disclosedDate: '2026-10-05',
    disclosedAgo: '5 days ago',
    weaknessCwe: 'Integer Overflow to Buffer Overflow',
    cvssScore: 5.9,
    summary: 'Integer overflow in 32-bit platform IMAP literal parser causing response synchronization loss and buffer corruption.',
    tags: ['32-bit', 'IMAP', 'Parser Desync']
  },
  {
    id: 'rep-khan-client-dos',
    reportNumber: 27,
    upvotes: 27,
    programHandle: 'khanacademy',
    programName: 'Khan Academy',
    state: 'Resolved',
    title: 'Client-Side Denial of Service (DoS) via Memory Exhaustion on Password Reset Endpoint',
    reporter: 'letx_world',
    disclosedDate: '2026-10-04',
    disclosedAgo: '6 days ago',
    weaknessCwe: 'Uncontrolled Resource Consumption',
    cvssScore: 6.5,
    summary: `A client-side denial of service vulnerability was identified on a password reset endpoint. When the endpoint was accessed by an authenticated user, the browser automatically generated thousands of requests without user interaction, resulting in rapid memory exhaustion and browser freeze.`,
    tags: ['Client DoS', 'Infinite Loop', 'Password Reset']
  },
  {
    id: 'rep-mariadb-connector-stack-overflow',
    reportNumber: 22,
    upvotes: 22,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'libmariadb (mariadb-connector-c): stack overflow via server-controlled field->length in prepared-statement codec',
    reporter: 'fg0x0',
    disclosedDate: '2026-10-04',
    disclosedAgo: '6 days ago',
    weaknessCwe: 'Stack Overflow',
    cvssScore: 7.5,
    summary: `A stack overflow vulnerability in mariadb-connector-c where a malicious server or network MITM could crash client applications by sending column-definition packets with excessively large field-length values directly into alloca() stack allocation without bounds checking.`,
    tags: ['libmariadb', 'Stack Overflow', 'Connector-C']
  },
  {
    id: 'rep-mariadb-mbstream-traversal',
    reportNumber: 27,
    upvotes: 27,
    programHandle: 'mariadb',
    programName: 'MariaDB',
    state: 'Resolved',
    title: 'Path Traversal in mbstream Extract',
    reporter: 'riscj',
    disclosedDate: '2026-10-03',
    disclosedAgo: '7 days ago',
    weaknessCwe: 'Path Traversal',
    cvssScore: 8.6,
    summary: `A path traversal vulnerability was discovered in the extraction code of a database backup utility (mbstream). Relative path traversal sequences in archive chunk headers were not sanitized, allowing extracted files to overwrite arbitrary files on the filesystem and achieve root-level command execution via cron or system configurations.`,
    tags: ['Path Traversal', 'mbstream', 'Root RCE', 'Backup Utility']
  }
];
